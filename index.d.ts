
export = Mautic;

declare namespace Mautic {
  type EntityID = string | number;

  type Parameters = Record<string, any>

  type EditMethod = 'PUT' | 'PATCH'

  interface ConnectorConstructorOptions {
    apiUrl: string
    username: string
    password: string
    timeoutInSeconds: number
    logLevel?: ( 'none' | 'error' | 'verbose' )
  }

  interface Response {
    status: number
    data: any
  }
}

declare class Mautic {

  constructor(options: Mautic.ConnectorConstructorOptions)

  assets: {
    getAsset: (assetId: Mautic.EntityID) => Promise<Mautic.Response>
    listAssets: (params: Mautic.Parameters) => Promise<Mautic.Response>
    createAsset: (params: Mautic.Parameters) => Promise<Mautic.Response>
  }

  campaigns: {
    getCampaign: (campaignId: Mautic.EntityID) => Promise<Mautic.Response>
    listCampaigns: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    listCampaignContacts: (campaignId: Mautic.EntityID) => Promise<Mautic.Response>
    addContactToCampaign: (campaignId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>,
    removeContactFromCampaign: (campaignId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>,
  }

  categories: {
    getCategory: (categoryId: Mautic.EntityID) => Promise<Mautic.Response>
    listContactCategories: () => Promise<Mautic.Response>,
    createCategory: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editCategory: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, categoryId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteCategory: (categoryId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  companies: {
    getCompany: (companyId: Mautic.EntityID) => Promise<Mautic.Response>
    listContactCompanies: () => Promise<Mautic.Response>
    createCompany: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editCompany: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, companyId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteCompany: (companyId: Mautic.EntityID) => Promise<Mautic.Response>
    addContactToCompany: (companyId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>
    removeContactFromCompany: (companyId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  contacts: {
    getContact: (contactId: Mautic.EntityID) => Promise<Mautic.Response>
    getContactByEmailAddress: (lemailAddress: string) => Promise<Mautic.Response>
    listContacts: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createContact: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editContact: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, contactId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteContact: (contactId: Mautic.EntityID) => Promise<Mautic.Response>
    addPoints: (contactId: Mautic.EntityID, queryParameters: Mautic.Parameters, points: number | string) => Promise<Mautic.Response>
    subtractPoints: (contactId: Mautic.EntityID, queryParameters: Mautic.Parameters, points: number | string) => Promise<Mautic.Response>
    listAvailableOwners: () => Promise<Mautic.Response>
    listAvailableFields: () => Promise<Mautic.Response>
    listContactNotes: (contactId: Mautic.EntityID, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    getSegmentMemberships: (contactId: Mautic.EntityID) => Promise<Mautic.Response>
    getCampaignMemberships: (contactId: Mautic.EntityID) => Promise<Mautic.Response>
    getActivityEventsForContact: (contactId: Mautic.EntityID, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    getContactCompanies: (contactId: Mautic.EntityID) => Promise<Mautic.Response>
    getContactDevices: (contactId: Mautic.EntityID) => Promise<Mautic.Response>
    addDoNotContact: (contactId: Mautic.EntityID, channel: string, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    removeDoNotContact: (contactId: Mautic.EntityID, channel: string) => Promise<Mautic.Response>
    addUtmTags: (contactId: Mautic.EntityID, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    removeUtmTags: (contactId: Mautic.EntityID, utmId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  dashboard: {
    getAvailableWidgetTypes: () => Promise<Mautic.Response>
  }

  dynamiccontent: {
    getDynamicContent: (contentId: Mautic.EntityID) => Promise<Mautic.Response>
    listDynamicContent: () => Promise<Mautic.Response>
    createDynamicContent: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editDynamicContent: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, contentId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteDynamicContent: (contentId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  emails: {
    getEmail: (emailId: Mautic.EntityID) => Promise<Mautic.Response>
    listEmails: () => Promise<Mautic.Response>
    createEmail: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editEmail: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, emailId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteEmail: (emailId: Mautic.EntityID) => Promise<Mautic.Response>
    sendEmailToContact: (emailId: Mautic.EntityID, contactId: Mautic.EntityID, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    sendEmailToSegment: (emailId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  fields: {
    getField: (fieldType: string, fieldId: Mautic.EntityID) => Promise<Mautic.Response>
    listContactFields: (fieldType: string) => Promise<Mautic.Response>
    createField: (fieldType: string, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editField: (method: Mautic.EditMethod, fieldType: string, queryParameters: Mautic.Parameters, fieldId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteField: (fieldType: string, fieldId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  forms: {
    getForm: (formId: Mautic.EntityID) => Promise<Mautic.Response>
    listForms: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createForm: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editForm: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, formId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteForm: (formId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteFormFields: (formId: Mautic.EntityID, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    deleteFormActions: (formId: Mautic.EntityID, queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    listFormSubmissions: (formId: Mautic.EntityID) => Promise<Mautic.Response>
    listFormSubmissionsForContact: (formId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>
    getFormSubmission: (formId: Mautic.EntityID, submissionId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  marketingmessages: {
    getMarketingMessage: (messageId: Mautic.EntityID) => Promise<Mautic.Response>
    listMarketingMessages: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createMarketingMessage: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editMarketingMessage: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, messageId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteMarketingMessage: (messageId: Mautic.EntityID) => Promise<Mautic.Response>
  };

  notes: {
    getNote: (noteId: Mautic.EntityID) => Promise<Mautic.Response>
    listContactNotes: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createNote: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editNote: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, noteId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteNote: (noteId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  notifications: {
    getNotification: (notificationId: Mautic.EntityID) => Promise<Mautic.Response>
    listNotifications: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createNotification: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editNotification: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, notificationId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteNotification: (notificationId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  pages: {
    getPage: (pageId: Mautic.EntityID) => Promise<Mautic.Response>
    listPages: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createPage: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editPage: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, pageId: Mautic.EntityID) => Promise<Mautic.Response>
    deletePage: (pageId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  pointactions: {
    getPointAction: (pointActionId: Mautic.EntityID) => Promise<Mautic.Response>
    listPointActions: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createPointAction: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editPointAction: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, pointActionId: Mautic.EntityID) => Promise<Mautic.Response>
    deletePointAction: (pointActionId: Mautic.EntityID) => Promise<Mautic.Response>
    getPointActionTypes: () => Promise<Mautic.Response>
  }

  pointtriggers: {
    getPointTrigger: (pointTriggerId: Mautic.EntityID) => Promise<Mautic.Response>
    listPointTriggers: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createPointTrigger: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editPointTrigger: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, pointTriggerId: Mautic.EntityID) => Promise<Mautic.Response>
    deletePointTrigger: (pointTriggerId: Mautic.EntityID) => Promise<Mautic.Response>
    getPointTriggerEventTypes: () => Promise<Mautic.Response>
  }

  roles: {
    getRole: (roleId: Mautic.EntityID) => Promise<Mautic.Response>
    listContactRoles: () => Promise<Mautic.Response>
    createRole: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editRole: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, roleId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteRole: (roleId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  segments: {
    getSegment: (segmentId: Mautic.EntityID) => Promise<Mautic.Response>
    listSegments: () => Promise<Mautic.Response>
    createSegment: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editSegment: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, segmentId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteSegment: (segmentId: Mautic.EntityID) => Promise<Mautic.Response>
    addContactToSegment: (segmentId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>
    removeContactFromSegment: (segmentId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  textmessages: {
    getTextMessage: (textMessageId: Mautic.EntityID) => Promise<Mautic.Response>
    listTextMessages: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createTextMessage: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editTextMessage: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, textMessageId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteTextMessage: (textMessageId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  stages: {
    getStage: (stageId: Mautic.EntityID) => Promise<Mautic.Response>
    listStages: () => Promise<Mautic.Response>
    createStage: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editStage: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, stageId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteStage: (stageId: Mautic.EntityID) => Promise<Mautic.Response>
    addContactToStage: (stageId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>
    removeContactFromStage: (stageId: Mautic.EntityID, contactId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  themes: {
    getTheme: (themeName: Mautic.EntityID) => Promise<Mautic.Response>
    getListOfThemes: () => Promise<Mautic.Response>
  }

  tweets: {
    getTweet: (tweetId: Mautic.EntityID) => Promise<Mautic.Response>
    listTweets: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createTweet: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editTweet: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, tweetId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteTweet: (tweetId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  users: {
    getUser: (userId: Mautic.EntityID) => Promise<Mautic.Response>
    listContactUsers: () => Promise<Mautic.Response>
    createUser: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editUser: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, userId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteUser: (userId: Mautic.EntityID) => Promise<Mautic.Response>
    getSelfUser: () => Promise<Mautic.Response>
    checkUserPermissions: (userId: Mautic.EntityID) => Promise<Mautic.Response>
  }

  webhooks: {
    getWebhook: (webhookId: Mautic.EntityID) => Promise<Mautic.Response>
    listWebhooks: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    createWebhook: (queryParameters: Mautic.Parameters) => Promise<Mautic.Response>
    editWebhook: (method: Mautic.EditMethod, queryParameters: Mautic.Parameters, webhookId: Mautic.EntityID) => Promise<Mautic.Response>
    deleteWebhook: (webhookId: Mautic.EntityID) => Promise<Mautic.Response>
    listAvailableWebhookTriggers: () => Promise<Mautic.Response>
  }
}
