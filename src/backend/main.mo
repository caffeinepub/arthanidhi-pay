// =============================================================================
// Indian Personal Finance Assistant Backend
// - Provides secure user authentication and profile management.
// - Manages accounts, transactions, statements, and financial health data.
// - Supplies market data, mutual fund, and stock details.
// =============================================================================
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    displayName : Text;
    email : ?Text;
    createdAt : Int;
  };

  type Account = {
    principal : Principal;
    balance : Nat;
    settings : Settings;
  };

  type Settings = {
    isDarkMode : Bool;
    preferredCurrency : Text;
  };

  type TransactionType = {
    #credit;
    #debit;
  };

  type Transaction = {
    id : Nat;
    timestamp : Int;
    amount : Nat;
    transactionType : TransactionType;
    description : Text;
  };

  module Transaction {
    public func compareByTimestamp(transaction1 : Transaction, transaction2 : Transaction) : Order.Order {
      Int.compare(transaction1.timestamp, transaction2.timestamp);
    };
  };

  module Account {
    public func compareByBalance(account1 : Account, account2 : Account) : Order.Order {
      Nat.compare(account1.balance, account2.balance);
    };
  };

  type MarketData = {
    symbol : Text;
    price : Nat;
    change : Int;
    currency : Text;
    category : Text;
    marketLabel : Text;
  };

  type TransactionRange = {
    startDate : ?Time.Time;
    endDate : ?Time.Time;
    transactionType : ?TransactionType;
  };

  type MutualFund = {
    name : Text;
    category : Text;
    nav : Nat;
    oneDayChange : Int;
    oneYearReturn : Int;
    currency : Text;
  };

  type Stock = {
    symbol : Text;
    company : Text;
    price : Nat;
    dailyChange : Int;
    currency : Text;
    market : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let accounts = Map.empty<Principal, Account>();
  let transactions = Map.empty<Principal, [Transaction]>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createAccount(displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create accounts");
    };

    if (accounts.containsKey(caller)) {
      Runtime.trap("Account already exists");
    };

    let defaultSettings : Settings = {
      isDarkMode = false;
      preferredCurrency = "INR";
    };

    let account : Account = {
      principal = caller;
      balance = 0;
      settings = defaultSettings;
    };

    accounts.add(caller, account);

    let profile : UserProfile = {
      displayName;
      email = null;
      createdAt = Time.now();
    };

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getBalance() : async (Nat, Text) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };

    let account = getAccountFromPrincipal(caller);
    (account.balance, account.settings.preferredCurrency);
  };

  public query ({ caller }) func getStatement(range : ?TransactionRange) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view statements");
    };

    let accountTransactions = getAccountTransactions(caller);

    switch (range) {
      case (null) { accountTransactions };
      case (?criteria) {
        let filtered : [Transaction] = accountTransactions.filter(
          func(txn) {
            let dateMatches = switch (criteria.startDate, criteria.endDate) {
              case (?start, ?end) {
                txn.timestamp >= start and txn.timestamp <= end
              };
              case (?start, null) { txn.timestamp >= start };
              case (null, ?end) { txn.timestamp <= end };
              case (null, null) { true };
            };

            let typeMatches = switch (criteria.transactionType) {
              case (?tType) { txn.transactionType == tType };
              case (null) { true };
            };

            dateMatches and typeMatches;
          }
        );
        filtered;
      };
    };
  };

  public query ({ caller }) func searchTransactions(keyword : Text) : async [Transaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search transactions");
    };

    let accountTransactions = getAccountTransactions(caller);
    let filtered = accountTransactions.filter(func(txn) { txn.description.contains(#text keyword) });
    filtered;
  };

  public query ({ caller }) func getFinancialHealthData() : async {
    balance : Nat;
    monthlyCredits : Nat;
    monthlyDebits : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view financial health data");
    };

    let account = getAccountFromPrincipal(caller);

    let now = Time.now();
    let monthAgo = now - (30 * 24 * 3600 * 1000000000);

    let recentTransactions = getAccountTransactions(caller).filter(func(txn) { txn.timestamp >= monthAgo });

    let credits = recentTransactions.filter(func(txn) { txn.transactionType == #credit });
    let debits = recentTransactions.filter(func(txn) { txn.transactionType == #debit });

    {
      balance = account.balance;
      monthlyCredits = credits.foldLeft(
        0,
        func(sum, txn) {
          sum + txn.amount;
        },
      );
      monthlyDebits = debits.foldLeft(
        0,
        func(sum, txn) {
          sum + txn.amount;
        },
      );
    };
  };

  public query ({ caller }) func getMarketSummary() : async [MarketData] {
    let marketData : [MarketData] = [
      {
        symbol = "NIFTY 50";
        price = 16500;
        change = 75;
        currency = "INR";
        category = "Index";
        marketLabel = "NSE Nifty 50";
      },
      {
        symbol = "SENSEX";
        price = 55000;
        change = -100;
        currency = "INR";
        category = "Index";
        marketLabel = "BSE Sensex";
      },
      {
        symbol = "RELIANCE";
        price = 2500;
        change = 40;
        currency = "INR";
        category = "Stock";
        marketLabel = "Reliance Industries";
      },
      {
        symbol = "TCS";
        price = 3400;
        change = 30;
        currency = "INR";
        category = "Stock";
        marketLabel = "Tata Consultancy Services";
      },
      {
        symbol = "INFY";
        price = 1700;
        change = 15;
        currency = "INR";
        category = "Stock";
        marketLabel = "Infosys";
      },
      {
        symbol = "HDFCBANK";
        price = 1500;
        change = 12;
        currency = "INR";
        category = "Stock";
        marketLabel = "HDFC Bank Ltd";
      },
      {
        symbol = "ICICIBANK";
        price = 700;
        change = 8;
        currency = "INR";
        category = "Stock";
        marketLabel = "ICICI Bank Ltd";
      },
    ];
    marketData;
  };

  public query ({ caller }) func getMutualFunds() : async [MutualFund] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view mutual funds");
    };

    let funds : [MutualFund] = [
      {
        name = "Axis Bluechip Fund";
        category = "Equity Large Cap";
        nav = 43;
        oneDayChange = 1;
        oneYearReturn = 18;
        currency = "INR";
      },
      {
        name = "HDFC Balanced Advantage Fund";
        category = "Hybrid";
        nav = 28;
        oneDayChange = 0;
        oneYearReturn = 14;
        currency = "INR";
      },
      {
        name = "SBI Small Cap Fund";
        category = "Equity Small Cap";
        nav = 106;
        oneDayChange = 2;
        oneYearReturn = 30;
        currency = "INR";
      },
      {
        name = "ICICI Prudential Liquid Fund";
        category = "Debt";
        nav = 305;
        oneDayChange = 0;
        oneYearReturn = 6;
        currency = "INR";
      },
    ];
    funds;
  };

  public query ({ caller }) func getStocks() : async [Stock] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view stocks");
    };

    let stocks : [Stock] = [
      {
        symbol = "RELIANCE";
        company = "Reliance Industries";
        price = 2500;
        dailyChange = 40;
        currency = "INR";
        market = "NSE";
      },
      {
        symbol = "HDFCBANK";
        company = "HDFC Bank";
        price = 1500;
        dailyChange = 12;
        currency = "INR";
        market = "BSE";
      },
      {
        symbol = "TCS";
        company = "Tata Consultancy Services";
        price = 3400;
        dailyChange = 30;
        currency = "INR";
        market = "NSE";
      },
      {
        symbol = "INFY";
        company = "Infosys";
        price = 1700;
        dailyChange = 15;
        currency = "INR";
        market = "NSE";
      },
      {
        symbol = "HDFCBBANK";
        company = "HDFC Bank Ltd";
        price = 1470;
        dailyChange = 10;
        currency = "INR";
        market = "BSE";
      },
    ];
    stocks;
  };

  public shared ({ caller }) func updateProfile(displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    let currentProfile = switch (userProfiles.get(caller)) {
      case (null) {
        Runtime.trap("Profile not found");
      };
      case (?profile) { profile };
    };

    let updatedProfile : UserProfile = {
      currentProfile with displayName
    };

    userProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func updateSettings(settings : Settings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update settings");
    };

    let account = getAccountFromPrincipal(caller);
    let updatedAccount : Account = {
      account with settings
    };

    accounts.add(caller, updatedAccount);
  };

  public query ({ caller }) func getSettings() : async Settings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view settings");
    };

    getAccountFromPrincipal(caller).settings;
  };

  public shared ({ caller }) func deposit(amount : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit");
    };

    let account = getAccountFromPrincipal(caller);
    let updatedBalance = account.balance + amount;
    let updatedAccount : Account = {
      account with balance = updatedBalance
    };

    accounts.add(caller, updatedAccount);

    let currentTransactions = switch (transactions.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };

    let newTransaction : Transaction = {
      id = currentTransactions.size() + 1;
      timestamp = Time.now();
      amount;
      transactionType = #credit;
      description;
    };

    let updatedTransactions = currentTransactions.concat([newTransaction]);
    transactions.add(caller, updatedTransactions);
  };

  public shared ({ caller }) func withdraw(amount : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can withdraw");
    };

    let account = getAccountFromPrincipal(caller);
    if (amount > account.balance) {
      Runtime.trap("Insufficient balance");
    };

    let updatedBalance = account.balance - amount;
    let updatedAccount : Account = {
      account with balance = updatedBalance
    };

    accounts.add(caller, updatedAccount);

    let currentTransactions = switch (transactions.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };

    let newTransaction : Transaction = {
      id = currentTransactions.size() + 1;
      timestamp = Time.now();
      amount;
      transactionType = #debit;
      description;
    };

    let updatedTransactions = currentTransactions.concat([newTransaction]);
    transactions.add(caller, updatedTransactions);
  };

  func getAccountFromPrincipal(p : Principal) : Account {
    switch (accounts.get(p)) {
      case (null) { Runtime.trap("Account not found") };
      case (?account) { account };
    };
  };

  func getAccountTransactions(p : Principal) : [Transaction] {
    switch (transactions.get(p)) {
      case (null) { [] };
      case (?txns) { txns };
    };
  };
};
