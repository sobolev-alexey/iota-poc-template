export const getNextUsers = (project, user, item) => {
  const nextStatus = user.nextEvents[item.status.toLowerCase().replace(/[- ]/g, '')]
  const nextUserRoles = [];
  Object.keys(project.events).forEach(role => {
    if (project.events[role] && project.events[role].previousEvent) {
      project.events[role].previousEvent.forEach(event => {
        if (event === nextStatus) {
          nextUserRoles.push(role);
        }
      });
    }
  });
  const newUsers = nextUserRoles.map(role => project.roleUserMapping[role])
  return newUsers;
};
