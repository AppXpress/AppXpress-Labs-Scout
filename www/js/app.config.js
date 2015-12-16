/**
 * @ngdoc function
 * @name weather_config
 * @description Unified global config for the app
 * @author nthusitha
 * @since 0.0.1
 */
var weather_config = {
	"debug" : false,
	"alert" : false,
	"gcm_sender_id" : "767071856414",
	"weather_server" :  "http://54.197.229.207",

	//"weather_server" : "http://192.168.1.9:8080/weather-server",

	"gtnx_url" : "https://platform-preprod.gtnexus.com/rest/310",
	"gtnx_self" : "/User/self",
	"gtnx_party_list_uri" : "/party/list?dataKey=",
	"gtnx_dataKey" : "96a5efe67b24dda73cf276ee8e1804b71ab43186",
	"gtnx_appx_demo_dataKey" : "96a5efe67b24dda73cf276ee8e1804b71ab43186",
	"gtnx_subscription_global_type" : "$platformSubscriberS1",
	"gtnx_get_subs_oql" : "status=\'Active\'",
	"gtnx_user" : "bridges01",
	"gtnx_pw" : "bridges2015",
	"gtnx_sup_qa_url" : "https://commerce-supportq.qa.gtnexus.com/rest/310/",
	"create_sub_url" : "/alert/subscribe",
	"gtnx_cqa_url" : "https://cqa.tradecard.com/rest/310/",
	"content_type" : "application/json",
	"platform_subscription_design" : "$platformSubscriberS1",
	"middle_server_subscToggle_url" : "/subsc/toggle",
	"middle_server_purge_subsc_url" : "/subsc/purge",
	"middle_server_subscToggle_state_url" : "/subsc/checkstate",
	"middle_server_donot_disturb_url" : "/device/donotdisturb",
	"middle_server_device_register_url" : "/device/register",
	"middle_server_detail_alert_url" : "/alert/detail",
	"middle_server_all_alerts_url" : "/alerts/all",
	"local_storage_platform_susbscirber_json_key" : "platform_susbscirber_json",
	"local_storage_platform_subscriber_id_key" : "platform_subscriber_id",
	"local_storage_pushd_subscriber_id_key" : "pushd_subscriber_id",
	"local_storage_auth_token_key" : "auth_token",
	"local_storage_last_device_token_sync_time_key" : "last_device_token_sync",
	"google_map_javascript_api_url" : "http://maps.google.com/maps/api/geocode/json",
	"apns_device_token_refresh_interval_ms" : 7200000,
	"org_info_design" : "$OrgInfoB1",
	"admin_userName" : "scoutsuper",
	"admin_password" : "tradecard",
	"get_logged_user_url" : "User/self",
	"moment_date_time_format" : "MMMM Do YYYY, h:mm:ss a",
	"social_info_url" : "http://aamirafridi.com/twitter/",
	"get_weather_provider_url" : "/weather/provider",
	"agreed_to_push_notifications" : 'undefined'
// every 2 hours

}
