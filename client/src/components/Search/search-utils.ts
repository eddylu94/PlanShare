import { InputChangeEvent } from "@utils/interfaces";
import { IFiltersSubscriptionCategory } from "@utils/utils";

export const SORT_BY = {
  DATE_ASC: "date_asc",
  DATE_DES: "date_des"
};

export interface ISearchFiltersProps {
  isDrawer?: boolean;
  filtersSubscriptionCategories: IFiltersSubscriptionCategory[];
  filtersGroupSize: number[];
  filtersPrice: number[];
  filtersSortBy: string;
  filtersDaysActive: number;
  toggleFiltersSubscriptionCategory: (
    event: InputChangeEvent,
    subscriptionCategoryId: string
  ) => void;
  handleGroupSizeChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
  handlePriceChange: (event: Event, value: number | number[]) => void;
  handleSortByChange: (event: InputChangeEvent) => void;
  handleDaysActiveChange: (
    event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => void;
}
