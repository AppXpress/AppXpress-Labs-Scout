/*
 * App's prototype object goes here.
 * Custom object specific prototypes are prefixed with C.
 * Middle server specific prototypes are prefixed with M.
 * @deprecated
 * */

/* Subscription - for middle server.*/
function MSubscription(subscriberId, subscriptionId, location, device, severity, interval) {
	this.platformSubscriberId = subscriberId;
	this.platformSubId = subscriptionId;
	// list of MLocation
	this.location = location;
	this.device = device;
	this.severity = severity;
	this.interval = interval;
	this.startDate = new Date();
	this.endDate = null;

}

function MLocation(uid, city, country, postcode, lat, lon, serviceProvider) {
	this.uid = uid;
	this.city = city;
	this.country = country;
	this.postcode = postcode;
	this.lat = lat;
	this.lon = lon;
	this.serviceProvider = serviceProvider;
	this.active = true;
}

/*
 * platform = apns (hardcode to 'apns' for now)
 */
function MDevice(deviceToken, deviceName, platform, platformSubscriberId, pushdSubscriberId, doNotDisturb) {
	this.deviceToken = deviceToken;
	this.deviceName = deviceName;
	this.platform = platform;
	this.platformSubscriberId = platformSubscriberId;
	this.pushdSubscriberId = pushdSubscriberId;
	this.doNotDisturb = doNotDisturb;
}

/*
 * Custom Object Specific Prototypes.
 */
function CSubscription(uIdentifier, watchedFactory) {
	this.uIdentifier = uIdentifier;
	this.watchedFactory = watchedFactory;
	//this.severity = severity;
}