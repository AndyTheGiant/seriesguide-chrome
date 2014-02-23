
angular.module('SeriesGuide.thepiratebay', [])
/**
 * Autofill serie search component
 * Provides autofill proxy and adds the selected serie back to the MainController
 */
.controller('FindTPBTypeAheadCtrl', function ($scope, ThePirateBay) {

  $scope.selected = undefined;
  $scope.search = function(serie) {
  	return ThePirateBay.search(serie).then(function(res) { return res; });
  };
  $scope.selectSerie = function(serie) {
  	$scope.selected = serie.name;
  	console.log("Serie selected!", serie);
  }
})
/**
 * ThePirateBay provider
 * Allows searching for any content on tpb, ordered by most seeds
 */
.provider('ThePirateBay', function() {

 this.endpoints = {
 	search: 'http://thepiratebay.se/search/%s/0/7/0',
 	details: 'http://thepiratebay.se/torrent/%s',
 };
 
 /**
  * Switch between search and details
  */
 this.getUrl = function(type, param) {
 		return this.endpoints[type].replace('%s', encodeURIComponent(param));
 },

 this.parseSearch = function(result) {
 	var parser = new DOMParser();
	var doc = parser.parseFromString(result.data, "text/html");
 	var results = doc.querySelectorAll("#searchResult tbody tr");
 	var output = [];
 	for(var i=0; i<results.length;i++) {
 		output.push({
 			releasename: results[i].querySelector('td:nth-child(2) > div ').innerText,
			magnetlink: results[i].querySelector('td:nth-child(2) > a').outerHTML.replace(/img src=\"(.*)\/img\/icon-magnet.gif\"/igm, 'img src="static/img/icon-magnet.gif"'),
			seeders: results[i].querySelector("td:nth-child(3)").innerHTML,
			leechers: results[i].querySelector("td:nth-child(4)").innerHTML,
			row: results[i].innerHTML
 		})
 	}
 	console.log("parsed: ", output);
 	return output;
 }

 /**
  * Get wrapper, providing the actual search functions and result parser
  * Provides promises so it can be used in typeahead as well as in the rest of the app
  */
 this.$get = function($q, $http) {
    var self = this;
    return {
    	/**
    	 * Execute a generic tpb search, parse the results and return them as an array
    	 */
	    search: function(what) {
	    	var d = $q.defer();
	        $http({
	        	method: 'GET',
	            url: self.getUrl('search', what),
	            cache: true
	        }).then(function(response) {
	        	console.log("TPB search executed!", response);
	           d.resolve(self.parseSearch(response));
			}, function(err) {
				console.log('error!');
			  d.reject(err);
			});
			return d.promise;
	    },
	    /**
	     * Fetch details for a specific tpb torrent id
	     */
		torrentDetails: function(id) {
			var d = $q.defer();
			$http({
			  method: 'GET',
			  url: self.getUrl('details', id),
			  cache: true
			}).success(function(response) {
			  d.resolve({result: self.parseDetails(response)});
			}).error(function(err) {
			  d.reject(err);
			});
			return d.promise;
		}
    }
  }
})
.directive('piratebaySearch', function() {

	return {
		restrict: 'E',
		template: ['<div ng-controller="FindTPBTypeAheadCtrl">',
				    '<input type="text" ng-model="selected" placeholder="Search for anything on The Pirate Bay" typeahead-min-length="3" typeahead-loading="loadingTPB"',
				    'typeahead="result for results in search($viewValue)" typeahead-template-url="templates/typeAheadTPB.html"',
				    'typeahead-on-select="selectTPBItem($item)" class="form-control"> <i ng-show="loadingTPB" class="glyphicon glyphicon-refresh"></i>',
				'</div>'].join(' ')
	};
})