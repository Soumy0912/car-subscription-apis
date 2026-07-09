export const getpagination = (totalItems,currentpage,limit) => {
    const totalPages = Math.ceil(totalItems/limit);
    return {
        totalItems:totalItems,
        page:currentpage,
        limit,
        totalPages
    }
};