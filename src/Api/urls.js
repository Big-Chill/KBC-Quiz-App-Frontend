
// Authentication
export const LOGIN = 'user/login';
export const SIGNUP = 'user/signup';
export const ALL_USER = 'user/all';
export const GET_USER_ID = 'user/getUserId';
export const DELETE_USER = 'user/delete';
export const CHANGE_PASSWORD = 'user/changePassword';

// Category
export const ALL_CATEGORY = 'category/all';
export const ADD_CATEGORY = 'category/add';

// Difficulty
export const ALL_DIFFICULTY = 'difficulty/all';
export const ADD_DIFFICULTY = 'difficulty/add';

// Question
export const ALL_QUESTION = 'question/all';
export const ALL_QUESTION_COUNT = 'question/all/count';
export const ALL_QUESTION_PAGINATED = 'question/all/paginated';
export const GET_QUESTION = 'question/get';
export const CATEGORY_QUESTION = 'question/getByCategory';
export const DIFFICULTY_QUESTION = 'question/getByDifficulty';
export const CATEGORY_DIFFICULTY_QUESTION = 'question/getByCategoryAndDifficulty';
export const ADD_QUESTION = 'question/add';
export const ADD_BULK_QUESTION = 'question/addBulk';
export const UPDATE_QUESTION = 'question/update';
export const DELETE_QUESTION = 'question/delete';

// Admin
export const ALL_ADMIN = 'admin/all';
export const ADD_ADMIN = 'admin/add';
export const DELETE_ADMIN = 'admin/delete';

// Profile
export const ALL_PROFILE = 'profile/all';
export const IS_PROFILE_PRESENT = 'profile/isProfilePresent';
export const GET_PROFILE = 'profile/getByUserId';
export const ADD_PROFILE = 'profile/add';
export const UPDATE_PROFILE = 'profile/updateByUserId';

// Stat
export const ALL_STAT = 'stat/all';
export const GET_STAT = 'stat/get';
export const CATEGORY_STAT = 'stat/getStatByIdAndCategory';
export const DIFFICULTY_STAT = 'stat/getStatByIdAndDifficulty';
export const CATEGORY_DIFFICULTY_STAT = 'stat/getStatByIdAndCategoryAndDifficulty';
export const TOP_N_DIFFICULTY_STAT = 'stat/getTopNStatsOfDificultyOfUser';
export const TOP_N_CATEGORY_STAT = 'stat/getTopNStatsOfCategoryOfUser';
export const TOP_N_CATEGORY_DIFFICULTY_STAT = 'stat/getTopNStatsOfCategoryAndDifficultyOfUser';
export const TOP_N_STAT = 'stat/getTopNStatsOfUser';
export const ADD_STAT = 'stat/add';
