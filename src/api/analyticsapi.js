import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001', // Backend server URL
    withCredentials: true, // Enables cookies or tokens if needed
});

// General sales analytics
export const getAllSales = () => API.get('/analytics/sales');
export const getMonthlySales = () => API.get('/analytics/sales/monthly');
export const getQuarterlySales = () => API.get('/analytics/sales/quarterly');
export const getYearlySales = () => API.get('/analytics/sales/yearly');
export const getSalesComparison = (start1, end1, start2, end2) => 
    API.get(`/analytics/sales/comparison?start1=${start1}&end1=${end1}&start2=${start2}&end2=${end2}`);

// Product-specific analytics
export const getProductSales = (productId) => API.get(`/analytics/sales/product/${productId}`);
export const getProductMonthlySales = (productId) => API.get(`/analytics/sales/product/${productId}/monthly`);
export const getProductQuarterlySales = (productId) => API.get(`/analytics/sales/product/${productId}/quarterly`);
export const getProductYearlySales = (productId) => API.get(`/analytics/sales/product/${productId}/yearly`);
export const getProductSalesComparison = (productId, start1, end1, start2, end2) => 
    API.get(`/analytics/sales/product/${productId}/comparison?start1=${start1}&end1=${end1}&start2=${start2}&end2=${end2}`);

// Category analytics
export const getCategorySales = (categoryId) => API.get(`/analytics/sales/category/${categoryId}`);
export const getCategoryMonthlySales = (categoryId) => API.get(`/analytics/sales/category/${categoryId}/monthly`);
export const getCategoryQuarterlySales = (categoryId) => API.get(`/analytics/sales/category/${categoryId}/quarterly`);
export const getCategoryYearlySales = (categoryId) => API.get(`/analytics/sales/category/${categoryId}/yearly`);
export const getCategorySalesComparison = (categoryId, start1, end1, start2, end2) => 
    API.get(`/analytics/sales/category/${categoryId}/comparison?start1=${start1}&end1=${end1}&start2=${start2}&end2=${end2}`);

// Regional sales analytics
export const getSalesByProvince = () => API.get('/analytics/salesByProvince');
export const getSalesByCity = () => API.get('/analytics/salesByCity');
export const getSalesByCountry = () => API.get('/analytics/salesByCountry');

// Profit/Loss analytics
export const getDailyProfit = () => API.get('/analytics/sales/profitloss/daily');
export const getMonthlyProfit = () => API.get('/analytics/sales/profitloss/monthly');
export const getQuarterlyProfit = () => API.get('/analytics/sales/profitloss/quarterly');
export const getYearlyProfit = () => API.get('/analytics/sales/profitloss/yearly');
export const getProfitComparison = (start1, end1, start2, end2) => 
    API.get(`/analytics/sales/profitloss/comparison?start1=${start1}&end1=${end1}&start2=${start2}&end2=${end2}`);

// Product management analytics
export const getLowStockProducts = () => API.get('/analytics/product/lowStock');
export const getBestSellers = () => API.get('/analytics/product/bestSellers');
export const getMostViewedProducts = () => API.get('/analytics/product/mostViewed');
export const getDiscountEffectiveness = () => API.get('/analytics/discountEffectiveness');

// User analytics
export const getTopBuyers = () => API.get('/analytics/user/topBuyers');
export const getChurnRate = () => API.get('/analytics/user/churnRate');

// Inventory analytics
export const getInventoryTrend = () => API.get('/analytics/inventory');
export const getReorderNeeds = () => API.get('/analytics/inventory/reorder');

// Returns analytics
export const getReturnsSummary = () => API.get('/analytics/returns/summary');
export const getReturnsByReason = () => API.get('/analytics/returns/byReason');

export default API;

