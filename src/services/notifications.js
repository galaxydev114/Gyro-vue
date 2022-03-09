const createNotification = (group, type) => message => ({
  group,
  title: message,
  type
})

export const createSuccessNotification = createNotification('system', 'success')
export const createErrorNotification = createNotification('system', 'error')
export const createWarnNotification = createNotification('system', 'warn')
