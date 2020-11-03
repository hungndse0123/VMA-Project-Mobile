import DriverRepository from "./DriverRepository";
import ContributorRepository from "./ContributorRepository";
import UserStatusRepository from "./UserStatusRepository";
import UserRepository from "./UserRepository";

const repositories = {
  drivers: DriverRepository,
  contributors: ContributorRepository,
  userStatus: UserStatusRepository,
  users: UserRepository,
};

export const RepositoryFactory = {
  get: (name) => repositories[name],
};