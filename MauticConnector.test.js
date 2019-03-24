/**
 * Mautic API docs are here: https://developer.mautic.org/
 */
const moment = require('moment');
let mauticConnector;
let testContactId;

beforeAll(() => {
    const initializer = require('../../app/initializer');
    initializer.initializeCodeBerryLibrary();
    const config = require('@codeberry/nodejs').config;

    const mauticOptions = {
        apiUrl: config.get('mautic:API_URL'),
        username: config.get('mautic:USERNAME'),
        password: config.get('mautic:PASSWORD'),
    };
    const MauticConnector = require('../../app/services/mautic/MauticConnector');
    mauticConnector = new MauticConnector(mauticOptions);
});

test('Mautic can be reached.', async () => {
    /* Act */
    const campaigns = await mauticConnector.campaigns.listCampaigns();

    /* Assert */
    expect((campaigns || {}).total).toBeDefined();
});

test('Contact is created correctly', async () => {
    /* Arrange */
    const timeOfSubmission = moment();
    // noinspection SpellCheckingInspection
    const fieldKeyToValueMap = {
        full_name: 'Test User',
        firstname: 'Test',
        lastname: 'User',
        email: 'test@user.test',
        signup_date_time: timeOfSubmission.subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss'),
        latest_activity_date_time: timeOfSubmission.format('YYYY-MM-DD HH:mm:ss'),
        full_locale_code: 'xx-XX',
        coupon_code_used_for_reg: '',
        is_subscribed_marketing: true,
        has_active_subscription: false,
        had_subscription_before: false,
        subscription_plan_type: 'no-plan',
        subscription_plan_name: 'NO PLAN!',
        referrer_code_used: undefined,
        own_referral_code: 'XXX',
        referral_event_count: 0,
        referred_trial_count: 0,
        referred_paying_count: 0,
        is_arrived_via_referral: false,
        total_submission_count: 5,
        payment_processor_name: 'Braintree',
        direct_transfer_code: null,
        last_viewed_plan_id: undefined,
    };

    /* Act */
    /** @type {{contact: {fields: {all: Object.<string, *>}}, id: number}} */
    const response = await mauticConnector.contacts.createContact(fieldKeyToValueMap);

    /* Assert */
    testContactId = response.contact.id;
    for(const [key, value] of Object.entries(fieldKeyToValueMap)) {
        const expectedValue = (value !== undefined && value !== '') ? value : null;
        try {
            expect(response.contact.fields.all[key]).toBe(expectedValue);
        } catch(error) {
            throw new Error(error.message + ' – Key: "' + key + '". Value: "' + value + '". Field value: "' + response.contact.fields.all[key] + '".');
        }
    }
});

test('Test contact is found by email address', async () => {
    /* Act */
    /** @type {{total: number, contacts: Object.<string, {fields: {all: {full_name: string}}}>}} */
    const response = await mauticConnector.contacts.getContactByEmailAddress('email:test@user.test');

    /* Assert */
    expect(response.total).toBe('1');
    expect(Object.values(response.contacts)[0].fields.all.full_name).toBe('Test User');
});

test('UTM tags can be added', async () => {
    /* Arrange */
    const fieldKeyToValueMap = {
        utm_medium: 'google',
        utm_content: 'utmContent',
        utm_source: 'google',
        utm_campaign: 'google ads',
        utm_term: 'here',
    };

    /* Act */
    /** @type {{contact: {utmtags: Object<string, string>[]}}} */
    const response = await mauticConnector.contacts.addUtmTags(testContactId, fieldKeyToValueMap);

    /* Assert */
    expect(response.contact.utmtags[0]['utmMedium']).toBe('google');
    expect(response.contact.utmtags[0]['utmContent']).toBe('utmContent');
    expect(response.contact.utmtags[0]['utmSource']).toBe('google');
    expect(response.contact.utmtags[0]['utmCampaign']).toBe('google ads');
    expect(response.contact.utmtags[0]['utmTerm']).toBe('here');
});

test('UTM tags can be deleted', async () => {
    /* Arrange */
    const utmId = (await mauticConnector.contacts.getContact(testContactId)).contact.utmtags[0].id;

    /* Act */
    /** @type {{contact: {utmtags: Object<string, string>[]}}} */
    const response = await mauticConnector.contacts.removeUtmTags(testContactId, utmId);

    /* Assert */
    expect(response.contact.utmtags.length).toBe(0);
});

test('Contact is deleted correctly', async () => {
    /* Act */
    /** @type {{contact: {id: number}}} */
    const response = await mauticConnector.contacts.deleteContact(testContactId);

    /* Assert */
    expect(response.contact.id).toBeNull();
});
