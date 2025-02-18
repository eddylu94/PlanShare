import { InputChangeEvent } from "@utils/interfaces";
import {
  IFiltersNeighborhood,
  IFiltersSubscriptionCategory
} from "@utils/utils";

export const SORT_BY = {
  DATE_ASC: "date_asc",
  DATE_DES: "date_des"
};

export interface ISearchFiltersProps {
  isDrawer?: boolean;
  filtersNeighborhoods: IFiltersNeighborhood;
  filtersSubscriptionCategories: IFiltersSubscriptionCategory[];
  filtersSubscriptionNeighborhoods: { label: string; value: string }[];
  filtersGroupSize: number[];
  filtersPrice: number[];
  filtersSortBy: string;
  filtersDaysActive: number;
  toggleFiltersSubscriptionCategory: (
    event: InputChangeEvent,
    subscriptionCategoryId: string
  ) => void;
  handleNeighborhoodsChange: (
    val: Array<{ label: string; value: string }>
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
