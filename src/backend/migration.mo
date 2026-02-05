import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, OldUserProfile>;
  };

  type NewUserProfile = {
    name : Text;
    address : Text;
    idDocumentNumber : Text;
    dateOfBirth : Text;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_id, oldProfile) {
        {
          oldProfile with
          address = "";
          idDocumentNumber = "";
          dateOfBirth = "";
        };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
