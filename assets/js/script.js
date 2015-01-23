$(function() {

	//Create a services model
	var Service = Backbone.Model.extend({
		//Three attributes set with defaults
		defaults:{
			title:'My service',
			price: 100,
			checked: false
		},
		//Helper function for checking/unchecking a service
		toggle: function(){
			this.set('checked', !this.get('checked'));
		}
	});

	//Create collection of services
	var ServiceList = Backbone.Collection.extend({
		//Specify model
		model: Service,
		//Return array of checked services
		getChecked: function(){
			return this.where({checked: true});
		}
	});

	//Prefill our ServiceList collection. Usually would come from REST API or other source
	var services = new ServiceList([
		new Service({title: 'web development', price:1000}),
		new Service({title: 'web design', price: 500}),
		new Service({title: 'logo design', price: 100}),
		new Service({title: 'PSD to HTML conversion', price: 300})
		]);

	//Create a service view, converts service model to HTML
	var ServiceView = Backbone.View.extend({
		tagName: 'li',
		events:{
			'click':'toggleService'
		},
		initialize: function() {
			//listen to model changes and run render() on change
			this.listenTo(this.model, 'change', this.render);
		},
		render: function() {
			//Create HTML
			this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('title') + '" /> ' + this.model.get('title') + '<span>$' + this.model.get('price') + '</span>');
			this.$('input').prop('checked', this.model.get('checked'));

			//returning this object is good practice and makes chaining possible
			return this;
		},
		toggleService: function(){
			this.model.toggle();
		}
	});

	//Main view of application
	var App = Backbone.View.extend({
		//Base view on existing element
		el: $("main"),
		initialize: function() {
			//Easy variables for common selectors
			this.total = $("#total span");
			this.list = $("#services");

			this.listenTo(services, 'change', this.render);

			services.each(function(service) {
				var view = new ServiceView({
					model: service
				});

                this.list.append(view.render().el);
			}, this);

		},
		render: function() {
			//Calculate our total each time render is called on services change
			var total = 0;
			_.each(services.getChecked(), function(elem) {
				total += elem.get('price');
			});

			this.total.text('$'+total);

			return this;
		}
	});

	new App();
});