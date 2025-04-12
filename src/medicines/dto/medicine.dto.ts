export interface FindAllMedicinesParams {
  name?: string;
  page?: number;
  limit?: number;
}

export interface FilterBestSellingMedicineParams {
  startDate?: string,
  endDate?: string
}