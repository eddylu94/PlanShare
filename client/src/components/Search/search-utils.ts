import { InputChangeEvent } from "../../utils/interfaces";
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
    event: InputChangeEvent,
    organizationId: string
  ) => void;
  toggleFiltersSubscriptionCategory: (
    event: InputChangeEvent,
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
  handleSortByChange: (event: InputChangeEvent) => void;
  handleDaysActiveChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
}
