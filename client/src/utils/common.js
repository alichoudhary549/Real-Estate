export const getMenuStyles = (menuOpened) => {
  if (document.documentElement.clientWidth <= 800) {
    return { right: !menuOpened && "-100%" };
  }
};

export const sliderSettings = {
  slidesPerView: 1,
  spaceBetween: 50,
  breakpoints: {
    480: {
      slidesPerView: 1,
    },
    600: {
      slidesPerView: 2,
    },
    750: {
      slidesPerView: 3,
    },
    1100: {
      slidesPerView: 4,
    },
  },
};

export const updateFavourites = (id, favourites) => {
  const idStr = String(id);
  const favsStr = favourites.map(fav => String(fav));
  if (favsStr.includes(idStr)) {
    return favourites.filter((resId) => String(resId) !== idStr);
  } else {
    return [...favourites, id];
  }
};

export const checkFavourites = (id, favourites) => {
  if (!favourites || !Array.isArray(favourites)) return "white";
  const idStr = String(id);
  const favsStr = favourites.map(fav => String(fav));
  return favsStr.includes(idStr) ? "#fa3e5f" : "white";
};

export const validateString = (value) => {
  return value?.length < 3 || value === null
    ? "Must have atleast 3 characters"
    : null;
};
