import {
  IFiltersOrganization,
  IFiltersSubscriptionCategory
} from "../../utils/utils";

export const SORT_BY = {
  DATE_ASC: "date_asc",
  DATE_DES: "date_des",
  SUBSCRIPTION_BRAND_ASC: "subscription_brand_asc",
  SUBSCRIPTION_BRAND_DES: "subscription_brand_des"
};

export interface ISearchFiltersProps {
  isDrawer?: boolean;
  filtersOrganizations: IFiltersOrganization[];
  filtersSubscriptionCategories: IFiltersSubscriptionCategory[];
  filtersGroupSize: number[];
  filtersPrice: number[];
  filtersSortBy: string;
  filtersDaysActive: number;
  toggleFiltersOrganization: (
    event: React.ChangeEvent<HTMLInputElement>,
    organizationId: string
  ) => void;
  toggleFiltersSubscriptionCategory: (
    event: React.ChangeEvent<HTMLInputElement>,
    subscriptionCategoryId: string
  ) => void;
  handleGroupSizeChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
  handlePriceChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
  handleSortByChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDaysActiveChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
}
