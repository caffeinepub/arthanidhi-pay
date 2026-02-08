import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  public type Account = {
    customerId : Text;
    accountNumber : Text;
    balance : Nat;
    transactionHistory : [TransactionRecord];
    name : Text;
    address : Text;
    idDocumentNumber : Text;
    dateOfBirth : Text;
  };

  public type TransactionRecord = {
    id : Nat;
    amount : Nat;
    fromAccount : Text;
    toAccount : Text;
    timestamp : Nat;
    description : Text;
  };

  // State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let accounts = Map.empty<Principal, Account>();
  var nextTransactionId = 0;
  let INITIAL_BALANCE = 100_000;

  // Helper functions
  func generateCustomerId() : Text {
    let timestamp = Time.now().toNat();
    "UIDAI-" # timestamp.toText();
  };

  func generateAccountNumber() : Text {
    let randomNum = (Time.now() % 1_000_000_000).toNat();
    "INR-" # randomNum.toText();
  };

  func getOrCreateAccount(profile : Account) : Account {
    let updatedCustomerId = if (profile.customerId == "") {
      generateCustomerId();
    } else {
      profile.customerId;
    };

    let updatedAccountNumber = if (profile.accountNumber == "") {
      generateAccountNumber();
    } else {
      profile.accountNumber;
    };

    let updatedBalance = if (profile.customerId == "") {
      INITIAL_BALANCE;
    } else {
      profile.balance;
    };

    {
      profile with
      customerId = updatedCustomerId;
      accountNumber = updatedAccountNumber;
      balance = updatedBalance;
    };
  };

  // Public functions
  public query ({ caller }) func getCallerAccount() : async ?Account {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access accounts");
    };
    accounts.get(caller);
  };

  public query ({ caller }) func getAccount(user : Principal) : async ?Account {
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own account unless you are admin");
    };
    accounts.get(user);
  };

  public query ({ caller }) func getTransactionHistory() : async [TransactionRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access transaction history");
    };
    switch (accounts.get(caller)) {
      case (null) { [] };
      case (?account) { account.transactionHistory };
    };
  };

  public shared ({ caller }) func saveCallerAccount(profile : Account) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save accounts");
    };
    accounts.add(caller, getOrCreateAccount(profile));
  };

  public shared ({ caller }) func transfer(fromAccount : Text, toAccount : Text, amount : Nat, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform transfers");
    };

    // Find the from account and verify ownership
    var fromPrincipal : ?Principal = null;
    var fromProfile : ?Account = null;

    for ((principal, account) in accounts.entries()) {
      if (account.accountNumber == fromAccount) {
        fromPrincipal := ?principal;
        fromProfile := ?account;
      };
    };

    let fromP = switch (fromPrincipal) {
      case (null) { Runtime.trap("From account not found") };
      case (?p) { p };
    };

    let fromAcc = switch (fromProfile) {
      case (null) { Runtime.trap("From account not found") };
      case (?a) { a };
    };

    // CRITICAL: Verify caller owns the from account
    if (not Principal.equal(caller, fromP) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only transfer from your own account");
    };

    if (fromAcc.balance < amount) {
      Runtime.trap("Insufficient balance");
    };

    // Find the to account
    var toPrincipal : ?Principal = null;
    var toProfile : ?Account = null;

    for ((principal, account) in accounts.entries()) {
      if (account.accountNumber == toAccount) {
        toPrincipal := ?principal;
        toProfile := ?account;
      };
    };

    let toP = switch (toPrincipal) {
      case (null) { Runtime.trap("To account not found") };
      case (?p) { p };
    };

    let toAcc = switch (toProfile) {
      case (null) { Runtime.trap("To account not found") };
      case (?a) { a };
    };

    let transaction : TransactionRecord = {
      id = nextTransactionId;
      amount;
      fromAccount;
      toAccount;
      timestamp = Time.now().toNat();
      description;
    };

    let updatedFromHistory = Array.tabulate(
      fromAcc.transactionHistory.size() + 1,
      func(i) {
        if (i == 0) { transaction } else {
          fromAcc.transactionHistory[i - 1];
        };
      },
    );

    let updatedToHistory = Array.tabulate(
      toAcc.transactionHistory.size() + 1,
      func(i) {
        if (i == 0) { transaction } else {
          toAcc.transactionHistory[i - 1];
        };
      },
    );

    let updatedFromProfile = {
      fromAcc with
      balance = fromAcc.balance - amount;
      transactionHistory = updatedFromHistory;
    };

    let updatedToProfile = {
      toAcc with
      balance = toAcc.balance + amount;
      transactionHistory = updatedToHistory;
    };

    accounts.add(fromP, updatedFromProfile);
    accounts.add(toP, updatedToProfile);

    nextTransactionId += 1;
  };

  public shared ({ caller }) func deposit(accountNumber : Text, amount : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can deposit funds");
    };

    // Find the account and verify ownership
    var targetPrincipal : ?Principal = null;
    var targetProfile : ?Account = null;

    for ((principal, account) in accounts.entries()) {
      if (account.accountNumber == accountNumber) {
        targetPrincipal := ?principal;
        targetProfile := ?account;
      };
    };

    let targetP = switch (targetPrincipal) {
      case (null) { Runtime.trap("Account not found") };
      case (?p) { p };
    };

    let targetAcc = switch (targetProfile) {
      case (null) { Runtime.trap("Account not found") };
      case (?a) { a };
    };

    // Verify caller owns the account (or is admin)
    if (not Principal.equal(caller, targetP) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only deposit to your own account");
    };

    let updatedProfile = { targetAcc with balance = targetAcc.balance + amount };
    accounts.add(targetP, updatedProfile);
  };
};
