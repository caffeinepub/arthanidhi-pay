import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Migration "migration";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

// Migration setup
(with migration = Migration.run)
actor {
  // User profile type with KYC fields
  public type UserProfile = {
    name : Text;
    address : Text;
    idDocumentNumber : Text;
    dateOfBirth : Text;
  };

  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage for user profiles with new KYC data
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  // Get any user's profile (own profile or admin can view others)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless you are an admin");
    };
    userProfiles.get(user);
  };

  // Save the caller's own profile (including KYC)
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };
};
