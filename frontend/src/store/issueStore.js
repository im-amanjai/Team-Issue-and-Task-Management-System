export const issueActions = (setIssues) => ({
  addIssue: (issue) => {
    setIssues((prev) => [issue, ...prev]);
  },

  addOrUpdateIssue: (issue) => {
    setIssues((prev) => {
      const exists = prev.find((i) => i._id === issue._id);
      if (exists) {
        return prev.map((i) => (i._id === issue._id ? issue : i));
      }
      return [issue, ...prev];
    });
  },

  updateIssue: (issue) => {
    setIssues((prev) =>
      prev.map((i) => (i._id === issue._id ? issue : i))
    );
  },

  removeIssue: (issueId) => {
    setIssues((prev) => prev.filter((i) => i._id !== issueId));
  },
});
