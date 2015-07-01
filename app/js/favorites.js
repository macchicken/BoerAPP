(function () {
	window.Favorites = {
		show: function() {
			window.Photos.data.filter({ field: "views", operator: "gte", value: 1 });
		},
		hide: function() {
			window.Photos.data.filter([]);
		}
	};
}());