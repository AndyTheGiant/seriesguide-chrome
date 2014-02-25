/**
 * Handle global dependencies
 */

angular.module('SeriesGuide', [
	'ngRoute',
	'xml',	
    'datePicker',
    'ui.bootstrap',
    'SeriesGuide.calendar',
    'SeriesGuide.providers',
    'SeriesGuide.directives', 
    'SeriesGuide.controllers', 
    'SeriesGuide.thepiratebay',
    'SeriesGuide.kickasstorrents',
    'SeriesGuide.torrentfreak',
    'SeriesGuide.tvrage',
    'SeriesGuide.tvrage.sync',
    'SeriesGuide.thetvdb',
    'SeriesGuide.imdb',
    'colorpicker.module',
    'lazy-background'
 ])

/**
 * Set up the xml interceptor and whitelist the chrome extension's filesystem and magnet links
 */
.config(function ($httpProvider, $compileProvider) {
    $httpProvider.interceptors.push('xmlHttpInterceptor');  
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|magnet):/);
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file):|data:image|filesystem:chrome-extension:/);
 })


/**
 * Unsafe HTML entities passthrough.
 * (Used for for instance typeAheadIMDB.html)
 */
.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
})

.filter('unsafeurl', function($sce) {
    return function(val) {
        $out =  $sce.trustAsResourceUrl(val);
        debugger;
        return $out;
    };
})

/**
 * Routing configuration. 
 */
.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'templates/home.html', 
      controller: 'MainCtrl'
    })
    .when('/watchlist', {
        templateUrl: 'templates/watchlist.html',
        controller: 'WatchlistCtrl'
    })
    .when('/series/:id', {
    	templateUrl: 'templates/serie.html',
    	controller: 'SerieCtrl'
    })
    .when('/serie/:id/episode/:episode', {
        templateUrl: 'templates/episode.html',
        controller: 'EpisodeCtrl'
    })
    .when('/settings', {
      templateUrl: 'templates/settings.html',
      controller: 'SettingsCtrl'
    })
    .otherwise({redirectTo: '/'});
})

