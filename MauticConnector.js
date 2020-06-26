/**
 * Repo: https://github.com/vdavid/node-mautic/
 *
 * Mautic API docs are here: https://developer.mautic.org/
 */
const request = require('request');

/**
 * @typedef {object} MauticConnectorConstructorOptions
 * @property {string} apiUrl
 * @property {string} username
 * @property {string} password
 * @property {string} [logLevel] Can be "none", "error" and "verbose". Default is "none".
 *           "none": No console.log calls will be used.
 *           "error": Only errors will be logged to the console.
 *           "verbose": All API calls will be logged to the console.
 * @property {string} [enableErrorLogging] Default: false
 * @property {number} [timeoutInSeconds]
 */
module.exports = class MauticConnector {
    /**
     * @param {MauticConnectorConstructorOptions} options
     */
    constructor(options) {
        this._mauticBaseUrl = options.apiUrl;
        this._username = options.username;
        this._password = options.password;
        this._logLevel = options.logLevel || "none";
        this._timeoutInMilliseconds = options.timeoutInSeconds * 1000;

        this._initializeMethods();
    }

    /**
     * @param {Object} requestParameters
     * @returns {Promise<{response: IncomingMessage, body: String|Buffer|Object}>} If "json" is true then an Object, otherwise string or Buffer.
     * @private
     */
    _requestPromisified(requestParameters) {
        requestParameters.timeout = this._timeoutInMilliseconds;
        return new Promise(function (resolve, reject) {
            request(requestParameters, (error, response, body) => error ? reject(error) : resolve({response, body}));
        });
    }

    /**
     * @param {Object} requestParams
     * @returns {Object}
     * @private
     */
    _addBasicAuthenticationHeader(requestParams) {
        const base64EncodedUsernameAndPassword = Buffer.from(this._username + ':' + this._password).toString('base64');
        requestParams.headers = {
            ...(requestParams.headers || {}),
            'Authorization': 'Basic ' + base64EncodedUsernameAndPassword,
            'Content-Type': 'application/json'
        };
        return requestParams;
    }

    /**
     * @param {object} params
     * @returns {Promise<Object>}
     * @throws {Error} Thrown if Mautic API returns with an HTTP error.
     * @private
     */
    async _callApi(params) {
        if (this._logLevel === "verbose") {
            console.log('MAUTIC | Calling Mautic API... Method: ' + params.method + ', URL: ' + params.url);
        }
        /** @var {string|{errors: Array?}} body */
        let body;

        /* Calls Mautic API */
        try {
            ({body} = await this._requestPromisified(this._addBasicAuthenticationHeader(params)));
        } catch (error) {
            if (this._logLevel !== "none") {
                console.log('MAUTIC | Mautic API HTTP error. | ' + error);
            }
            throw error;
        }

        /* Parses response */
        const result = (typeof body === 'string') ? JSON.parse(body) : body;

        /* Handles errors */
        if (!result.errors) {
            return result;
        } else {
            const errors = body.errors instanceof Error ? [body.errors]
                : (result.errors instanceof Error ? [result.errors]
                    : (body.errors instanceof Array ? body.errors
                        : (result.errors instanceof Array) ? result.errors : []));
            const logMessage = 'MAUTIC | Mautic API error. | ' + errors.map(error => error.code + ': ' + error.message).join(', ');

            if (this._logLevel !== "none") {
                console.log(logMessage);
            }
            throw new Error(logMessage);
        }
    }

    /**
     * @param {Object<string, string>?} queryParameters As key-value pairs.
     * @returns {string} The query string, without the question mark.
     * @private
     */
    _convertQueryParametersToString(queryParameters = {}) {
        queryParameters = (queryParameters && (typeof queryParameters === 'object')) ? queryParameters : {};
        return Object.keys(queryParameters).map(key => key + '=' + queryParameters[key]).join('&');
    }

    /**
     * @param {string} path The part after the domain and before the query string.
     * @param {Object<string, string>?} queryParameters As key-value pairs.
     * @returns {string} The assembled URL.
     * @private
     */
    _makeUrl(path, queryParameters = {}) {
        const queryString = this._convertQueryParametersToString(queryParameters);
        return this._mauticBaseUrl + "/api" + path + (queryString ? '?' + queryString : '');
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @param {string} method "PUT" or "PATCH", or something else, but then it will trigger an error.
     * @returns {string} "PUT" or "PATCH".
     * @private
     */
    _ensureMethodIsPutOrPatch(method) {
        if (method === 'PUT' || method === 'PATCH') {
            return method;
        } else {
            throw new Error('Invalid method "' + method + '".');
        }
    }

    // noinspection JSMethodCanBeStatic
    /**
     * @param {string} fieldType "company" or "contact", or something else, but then it will trigger an error.
     * @returns {string} "company" or "contact".
     * @private
     */
    _ensureFieldTypeIsCompanyOrContact(fieldType) {
        if (fieldType === "company" || fieldType === "contact") {
            return fieldType;
        } else {
            throw new Error("Please enter either 'company' or 'contact' for the Field Type");
        }
    }

    /**
     * @private
     */
    _initializeMethods() {
        // noinspection JSUnusedGlobalSymbols
        this.assets = {
            getAsset: assetId => this._callApi({method: "GET", url: this._makeUrl("/assets/" + assetId)}),
            listAssets: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/assets", queryParameters)}),
            createAsset: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/assets/new"), body: JSON.stringify(queryParameters)}),
        };

        // noinspection JSUnusedGlobalSymbols
        this.campaigns = {
            getCampaign: campaignId => this._callApi({method: "GET", url: this._makeUrl("/campaigns/" + campaignId)}),
            listCampaigns: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/campaigns", queryParameters)}),
            listCampaignContacts: campaignId => this._callApi({method: "GET", url: this._makeUrl("/campaigns/" + campaignId + "/contacts")}),
            addContactToCampaign: (campaignId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/campaigns/" + campaignId + "/contact/" + contactId + "/add")}),
            removeContactFromCampaign: (campaignId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/campaigns/" + campaignId + "/contact/" + contactId + "/remove")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.categories = {
            getCategory: categoryId => this._callApi({method: "GET", url: this._makeUrl("/categories/" + categoryId + "")}),
            listContactCategories: () => this._callApi({method: "GET", url: this._makeUrl("/categories")}),
            createCategory: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/categories/new"), body: JSON.stringify(queryParameters)}),
            editCategory: (method, queryParameters, categoryId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/categories/" + categoryId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteCategory: categoryId => this._callApi({method: "DELETE", url: this._makeUrl("/categories/" + categoryId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.companies = {
            getCompany: companyId => this._callApi({method: "GET", url: this._makeUrl("/companies/" + companyId + "")}),
            listContactCompanies: () => this._callApi({method: "GET", url: this._makeUrl("/companies")}),
            createCompany: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/companies/new"), body: JSON.stringify(queryParameters)}),
            editCompany: (method, queryParameters, companyId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/companies/" + companyId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteCompany: companyId => this._callApi({method: "DELETE", url: this._makeUrl("/companies/" + companyId + "/delete")}),
            addContactToCompany: (companyId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/companies/" + companyId + "/contact/" + contactId + "/add")}),
            removeContactFromCompany: (companyId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/companies/" + companyId + "/contact/" + contactId + "/remove")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.contacts = {
            getContact: contactId => this._callApi({method: "GET", url: this._makeUrl("/contacts/" + contactId + "")}),
            getContactByEmailAddress: emailAddress => this.contacts.listContacts({search: emailAddress}),
            listContacts: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/contacts", queryParameters)}),
            createContact: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/contacts/new"), body: JSON.stringify(queryParameters)}),
            editContact: (method, queryParameters, contactId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/contacts/" + contactId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteContact: contactId => this._callApi({method: "DELETE", url: this._makeUrl("/contacts/" + contactId + "/delete")}),
            addPoints: (contactId, queryParameters, points) => this._callApi({method: "POST", url: this._makeUrl("/contacts/" + contactId + "/points/plus/" + points + ""), body: queryParameters ? JSON.stringify(queryParameters) : queryParameters}),
            subtractPoints: (contactId, queryParameters, points) => this._callApi({method: "POST", url: this._makeUrl("/contacts/" + contactId + "/points/minus/" + points + ""), body: queryParameters ? JSON.stringify(queryParameters) : queryParameters}),
            listAvailableOwners: () => this._callApi({method: "GET", url: this._makeUrl("/contacts/list/owners")}),
            listAvailableFields: () => this._callApi({method: "GET", url: this._makeUrl("/contacts/list/fields")}),
            listContactNotes: (contactId, queryParameters) => this._callApi({method: "GET", url: this._makeUrl("/contacts/" + contactId + "/notes", queryParameters)}),
            getSegmentMemberships: contactId => this._callApi({method: "GET", url: this._makeUrl("/contacts/" + contactId + "/segments")}),
            getCampaignMemberships: contactId => this._callApi({method: "GET", url: this._makeUrl("/contacts/" + contactId + "/campaigns")}),
            getActivityEventsForContact: (contactId, queryParameters) => this._callApi({method: "GET", url: this._makeUrl("/contacts/" + contactId + "/activity", queryParameters)}),
            getContactCompanies: contactId => this._callApi({method: "GET", url: this._makeUrl("/contacts/" + contactId + "/companies")}),
            getContactDevices: contactId => this._callApi({method: "GET", url: this._makeUrl("/contacts/" + contactId + "/devices")}),
            addDoNotContact: (contactId, channel, queryParameters) => this._callApi({method: "POST", url: this._makeUrl("/contacts/" + contactId + "/dnc/" + channel + "/add"), body: JSON.stringify(queryParameters)}),
            removeDoNotContact: (contactId, channel) => this._callApi({method: "POST", url: this._makeUrl("/contacts/" + contactId + "/dnc/" + channel + "/remove")}),
            addUtmTags: (contactId, queryParameters) => this._callApi({method: "POST", url: this._makeUrl("/contacts/" + contactId + "/utm/add"), body: JSON.stringify(queryParameters)}),
            removeUtmTags: (contactId, utmId) => this._callApi({method: "POST", url: this._makeUrl("/contacts/" + contactId + "/utm/" + utmId + "/remove")}),
        };

        // noinspection JSUnusedGlobalSymbols
        this.dashboard = {
            getAvailableWidgetTypes: () => this._callApi({method: "GET", url: this._makeUrl("/data")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.dynamiccontent = {
            getDynamicContent: contentId => this._callApi({method: "GET", url: this._makeUrl("/dynamiccontents/" + contentId + "")}),
            listDynamicContent: () => this._callApi({method: "GET", url: this._makeUrl("/dynamiccontents")}),
            createDynamicContent: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/dynamiccontents/new"), body: JSON.stringify(queryParameters)}),
            editDynamicContent: (method, queryParameters, contentId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/dynamiccontents/" + contentId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteDynamicContent: contentId => this._callApi({method: "DELETE", url: this._makeUrl("/dynamiccontents/" + contentId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.emails = {
            getEmail: emailId => this._callApi({method: "GET", url: this._makeUrl("/emails/" + emailId + "")}),
            listEmails: () => this._callApi({method: "GET", url: this._makeUrl("/emails")}),
            createEmail: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/emails/new"), body: JSON.stringify(queryParameters)}),
            editEmail: (method, queryParameters, emailId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/emails/" + emailId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteEmail: emailId => this._callApi({method: "DELETE", url: this._makeUrl("/emails/" + emailId + "/delete")}),
            sendEmailToContact: (emailId, contactId, queryParameters) => this._callApi({method: "POST", url: this._makeUrl("/emails/" + emailId + "/contact/" + contactId + "/send"), body: JSON.stringify(queryParameters || {})}),
            sendEmailToSegment: emailId => this._callApi({method: "POST", url: this._makeUrl("/emails/" + emailId + "/send")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.fields = {
            getField: (fieldType, fieldId) => this._callApi({method: "GET", url: this._makeUrl("/fields/" + this._ensureFieldTypeIsCompanyOrContact(fieldType) + "/" + fieldId + "")}),
            listContactFields: fieldType => this._callApi({method: "GET", url: this._makeUrl("/fields/" + this._ensureFieldTypeIsCompanyOrContact(fieldType))}),
            createField: (fieldType, queryParameters) => this._callApi({method: "POST", url: this._makeUrl("/fields/" + this._ensureFieldTypeIsCompanyOrContact(fieldType) + "/new"), body: JSON.stringify(queryParameters)}),
            editField: (method, fieldType, queryParameters, fieldId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/fields/" + this._ensureFieldTypeIsCompanyOrContact(fieldType) + "/" + fieldId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteField: (fieldType, fieldId) => this._callApi({method: "DELETE", url: this._makeUrl("/fields/" + this._ensureFieldTypeIsCompanyOrContact(fieldType) + "/" + fieldId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.forms = {
            getForm: formId => this._callApi({method: "GET", url: this._makeUrl("/forms/" + formId + "")}),
            listForms: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/forms", queryParameters)}),
            createForm: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/forms/new"), body: JSON.stringify(queryParameters)}),
            editForm: (method, queryParameters, formId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/forms/" + formId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteForm: formId => this._callApi({method: "DELETE", url: this._makeUrl("/forms/" + formId + "/delete")}),
            deleteFormFields: (formId, queryParameters) => this._callApi({method: "DELETE", url: this._makeUrl("/forms/" + formId + "/fields/delete", queryParameters)}),
            deleteFormActions: (formId, queryParameters) => this._callApi({method: "DELETE", url: this._makeUrl("/forms/" + formId + "/actions/delete", queryParameters)}),
            listFormSubmissions: formId => this._callApi({method: "GET", url: this._makeUrl("/forms/" + formId + "/submissions")}),
            listFormSubmissionsForContact: (formId, contactId) => this._callApi({method: "GET", url: this._makeUrl("/forms/" + formId + "/submissions/contact/" + contactId + "")}),
            getFormSubmission: (formId, submissionId) => this._callApi({method: "GET", url: this._makeUrl("/forms/" + formId + "/submissions/" + submissionId + "")}),
        };

        // noinspection JSUnusedGlobalSymbols
        this.marketingmessages = {
            getMarketingMessage: messageId => this._callApi({method: "GET", url: this._makeUrl("/messages/" + messageId + "")}),
            listMarketingMessages: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/messages", queryParameters)}),
            createMarketingMessage: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/messages/new"), body: JSON.stringify(queryParameters)}),
            editMarketingMessage: (method, queryParameters, messageId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/messages/" + messageId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteMarketingMessage: messageId => this._callApi({method: "DELETE", url: this._makeUrl("/messages/" + messageId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.notes = {
            getNote: noteId => this._callApi({method: "GET", url: this._makeUrl("/notes/" + noteId + "")}),
            listContactNotes: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/notes", queryParameters)}),
            createNote: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/notes/new"), body: JSON.stringify(queryParameters)}),
            editNote: (method, queryParameters, noteId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/notes/" + noteId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteNote: noteId => this._callApi({method: "DELETE", url: this._makeUrl("/notes/" + noteId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.notifications = {
            getNotification: notificationId => this._callApi({method: "GET", url: this._makeUrl("/notifications/" + notificationId + "")}),
            listNotifications: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/notifications", queryParameters)}),
            createNotification: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/notifications/new"), body: JSON.stringify(queryParameters)}),
            editNotification: (method, queryParameters, notificationId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/notifications/" + notificationId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteNotification: notificationId => this._callApi({method: "DELETE", url: this._makeUrl("/notifications/" + notificationId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.pages = {
            getPage: pageId => this._callApi({method: "GET", url: this._makeUrl("/pages/" + pageId + "")}),
            listPages: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/pages", queryParameters)}),
            createPage: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/pages/new"), body: JSON.stringify(queryParameters)}),
            editPage: (method, queryParameters, pageId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/pages/" + pageId + "/edit"), body: JSON.stringify(queryParameters)}),
            deletePage: pageId => this._callApi({method: "DELETE", url: this._makeUrl("/pages/" + pageId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.pointactions = {
            getPointAction: pointActionId => this._callApi({method: "GET", url: this._makeUrl("/points/" + pointActionId + "")}),
            listPointActions: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/points", queryParameters)}),
            createPointAction: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/points/new"), body: JSON.stringify(queryParameters)}),
            editPointAction: (method, queryParameters, pointActionId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/points/" + pointActionId + "/edit"), body: JSON.stringify(queryParameters)}),
            deletePointAction: pointActionId => this._callApi({method: "DELETE", url: this._makeUrl("/points/" + pointActionId + "/delete")}),
            getPointActionTypes: () => this._callApi({method: "GET", url: this._makeUrl("/points/actions/types")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.pointtriggers = {
            getPointTrigger: pointTriggerId => this._callApi({method: "GET", url: this._makeUrl("/points/triggers/" + pointTriggerId + "")}),
            listPointTriggers: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/points/triggers", queryParameters)}),
            createPointTrigger: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/points/triggers/new"), body: JSON.stringify(queryParameters)}),
            editPointTrigger: (method, queryParameters, pointTriggerId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/points/triggers/" + pointTriggerId + "/edit"), body: JSON.stringify(queryParameters)}),
            deletePointTrigger: pointTriggerId => this._callApi({method: "DELETE", url: this._makeUrl("/points/triggers/" + pointTriggerId + "/delete")}),
            getPointTriggerEventTypes: () => this._callApi({method: "GET", url: this._makeUrl("/points/triggers/events/types")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.roles = {
            getRole: roleId => this._callApi({method: "GET", url: this._makeUrl("/roles/" + roleId + "")}),
            listContactRoles: () => this._callApi({method: "GET", url: this._makeUrl("/roles")}),
            createRole: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/roles/new"), body: JSON.stringify(queryParameters)}),
            editRole: (method, queryParameters, roleId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/roles/" + roleId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteRole: roleId => this._callApi({method: "DELETE", url: this._makeUrl("/roles/" + roleId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.segments = {
            getSegment: segmentId => this._callApi({method: "GET", url: this._makeUrl("/segments/" + segmentId + "")}),
            listSegments: () => this._callApi({method: "GET", url: this._makeUrl("/segments")}),
            createSegment: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/segments/new"), body: JSON.stringify(queryParameters)}),
            editSegment: (method, queryParameters, segmentId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/segments/" + segmentId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteSegment: segmentId => this._callApi({method: "DELETE", url: this._makeUrl("/segments/" + segmentId + "/delete")}),
            addContactToSegment: (segmentId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/segments/" + segmentId + "/contact/" + contactId + "/add")}),
            removeContactFromSegment: (segmentId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/segments/" + segmentId + "/contact/" + contactId + "/remove")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.textmessages = {
            getTextMessage: textMessageId => this._callApi({method: "GET", url: this._makeUrl("/smses/" + textMessageId + "")}),
            listTextMessages: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/smses", queryParameters)}),
            createTextMessage: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/smses/new"), body: JSON.stringify(queryParameters)}),
            editTextMessage: (method, queryParameters, textMessageId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/smses/" + textMessageId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteTextMessage: textMessageId => this._callApi({method: "DELETE", url: this._makeUrl("/smses/" + textMessageId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.stages = {
            getStage: stageId => this._callApi({method: "GET", url: this._makeUrl("/stages/" + stageId + "")}),
            listStages: () => this._callApi({method: "GET", url: this._makeUrl("/stages")}),
            createStage: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/stages/new"), body: JSON.stringify(queryParameters)}),
            editStage: (method, queryParameters, stageId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/stages/" + stageId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteStage: stageId => this._callApi({method: "DELETE", url: this._makeUrl("/stages/" + stageId + "/delete")}),
            addContactToStage: (stageId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/stages/" + stageId + "/contact/" + contactId + "/add")}),
            removeContactFromStage: (stageId, contactId) => this._callApi({method: "POST", url: this._makeUrl("/stages/" + stageId + "/contact/" + contactId + "/remove")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.themes = {
            getTheme: themeName => this._callApi({method: "GET", url: this._makeUrl("/themes/" + themeName + "")}),
            getListOfThemes: () => this._callApi({method: "GET", url: this._makeUrl("/themes")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.tweets = {
            getTweet: tweetId => this._callApi({method: "GET", url: this._makeUrl("/tweets/" + tweetId + "")}),
            listTweets: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/tweets", queryParameters)}),
            createTweet: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/tweets/new"), body: JSON.stringify(queryParameters)}),
            editTweet: (method, queryParameters, tweetId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/tweets/" + tweetId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteTweet: tweetId => this._callApi({method: "DELETE", url: this._makeUrl("/tweets/" + tweetId + "/delete")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.users = {
            getUser: userId => this._callApi({method: "GET", url: this._makeUrl("/users/" + userId + "")}),
            listContactUsers: () => this._callApi({method: "GET", url: this._makeUrl("/users")}),
            createUser: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/users/new"), body: JSON.stringify(queryParameters)}),
            editUser: (method, queryParameters, userId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/users/" + userId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteUser: userId => this._callApi({method: "DELETE", url: this._makeUrl("/users/" + userId + "/delete")}),
            getSelfUser: () => this._callApi({method: "GET", url: this._makeUrl("/users/self")}),
            checkUserPermissions: userId => this._callApi({method: "GET", url: this._makeUrl("/users/" + userId + "/permissioncheck")})
        };

        // noinspection JSUnusedGlobalSymbols
        this.webhooks = {
            getWebhook: webhookId => this._callApi({method: "GET", url: this._makeUrl("/hooks/" + webhookId + "")}),
            listWebhooks: queryParameters => this._callApi({method: "GET", url: this._makeUrl("/hooks", queryParameters)}),
            createWebhook: queryParameters => this._callApi({method: "POST", url: this._makeUrl("/hooks/new"), body: JSON.stringify(queryParameters)}),
            editWebhook: (method, queryParameters, webhookId) => this._callApi({method: this._ensureMethodIsPutOrPatch(method), url: this._makeUrl("/hooks/" + webhookId + "/edit"), body: JSON.stringify(queryParameters)}),
            deleteWebhook: webhookId => this._callApi({method: "DELETE", url: this._makeUrl("/hooks/" + webhookId + "/delete")}),
            listAvailableWebhookTriggers: () => this._callApi({method: "GET", url: this._makeUrl("/hooks/triggers")})
        };
    }
};
