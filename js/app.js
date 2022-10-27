(function () {
  'use strict';
  
  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
  .directive('foundItems', FoundItems);

  NarrowItDownController.$inject = ['MenuSearchService'];
  MenuSearchService.$inject = ['$http'];
  
  function NarrowItDownController (MenuSearchService) {
    var narrowItDown = this;
    narrowItDown.searchTerm = "";

    narrowItDown.searchClick = function () {
      console.log("searchTerm: %s", narrowItDown.searchTerm);

      if (narrowItDown.searchTerm) {
        var promise = MenuSearchService.getMatchedMenuItems(narrowItDown.searchTerm);

        promise.then(function (response) {
          console.log(response);
          narrowItDown.found = response;
          if (narrowItDown.found.length > 0) {
            narrowItDown.message = null;
          } else {
            narrowItDown.message = "Nothing found";
          }
        });
      } else {
        console.log("should show message");
        narrowItDown.message = "Nothing found";
        narrowItDown.found = [];
      }
    };

    narrowItDown.removeItem = function (itemIndex) {
      console.log("remove item at ", itemIndex);
      narrowItDown.found.splice(itemIndex, 1);
      if (narrowItDown.found.length == 0) {
        narrowItDown.message = "Nothing found";
      }
    }
  }

  function MenuSearchService($http) {
    var service = this;

    service.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: 'GET',
        url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
      }).then(function (result) {
        // process result and only keep items that match
        var foundItems = result.data.menu_items.filter(item => item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
        // return processed items
        return foundItems;
      });
    };
  }

  function FoundItems() {
    var ddo = {
      templateUrl: 'foundItems.html',
      scope: {
        items: '<',
        onRemove: '='
      },
      controller: NarrowItDownController,
      controllerAs: 'narrowItDown',
      bindToController: true
    };

    return ddo;
  }
  
})();