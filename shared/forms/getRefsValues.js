export const getRefsValues = (objectWithRefs) =>
  Object.fromEntries(
    Object.keys(objectWithRefs)
      .map((key) => {
        if (objectWithRefs[key].current) {
          return [key, objectWithRefs[key].current.value];
        }
        return null;
      })
      .filter(Boolean),
  );
