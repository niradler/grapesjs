define(['./ComponentImage'],
	function (Component) {

		return Component.extend({

			defaults: _.extend({}, Component.prototype.defaults, {
					type: 'video',
					tagName: 'video',
					videoId: '',
					void: 0,
					provider: '', // on change of provider, traits are switched
					ytUrl: 'http://www.youtube.com/embed/',
					viUrl: 'http://player.vimeo.com/video/',
					loop: 0,
					muted: 0,
					autoplay: 0,
					controls: 1,
					color: '',
					sources: [],
			}),

			initialize: function(o, opt) {
				this.set('traits', this.getSourceTraits());
				Component.prototype.initialize.apply(this, arguments);
				this.listenTo(this, 'change:provider', this.updateTraits);
				this.listenTo(this, 'change:videoId', this.updateSrc);
			},

			/**
			 * Update src on change of video ID
			 * @private
			 */
			updateSrc: function() {
				var prov = this.get('provider');
				switch (prov) {
					case 'yt':
						this.set('src',this.getYoutubeSrc());
						break;
					case 'vi':
						this.set('src',this.getVimeoSrc());
						break;
				}
			},

			/**
			 * Returns attributes string in HTML
			 * @return {string}
			 * @private
			 */
			toAttrHTML: function() {
				var attr = Component.prototype.toAttrHTML.apply(this, arguments);
				var prov = this.get('provider');

				switch (prov) {
					case 'yt': case 'vi':
						break;
					default:
						if(this.get('loop'))
							attr += ' loop';
						if(this.get('autoplay'))
							attr += ' autoplay';
						if(this.get('controls'))
							attr += ' controls';
				}

				return attr;
			},

			/**
			 * Update traits by provider
			 * @private
			 */
			updateTraits: function() {
				var prov = this.get('provider');
				var traits = this.getSourceTraits();
				switch (prov) {
					case 'yt':
						this.set('tagName', 'iframe');
						traits = this.getYoutubeTraits();
						break;
					case 'vi':
						this.set('tagName', 'iframe');
						traits = this.getVimeoTraits();
						break;
					default:
						this.set('tagName', 'video');
				}
				this.loadTraits(traits);
				this.sm.trigger('change:selectedComponent');
			},

			// Listen provider change and switch traits, in TraitView listen traits change

			/**
			 * Return the provider trait
			 * @return {Object}
			 * @private
			 */
			getProviderTrait: function() {
				return {
					type: 'select',
					label: 'Provider',
					name: 'provider',
					changeProp: 1,
					value: this.get('provider'),
					options: [
						{value: 'so', name: 'HTML5 Source'},
						{value: 'yt', name: 'Youtube'},
						{value: 'vi', name: 'Vimeo'}
					]
				};
			},

			/**
			 * Return traits for the source provider
			 * @return {Array<Object>}
			 * @private
			 */
			getSourceTraits: function() {
				return [
					this.getProviderTrait(), {
						label: 'Source',
						name: 'src',
						placeholder: 'eg. ./media/video.mp4',
						changeProp: 1,
					},
					this.getAutoplayTrait(),
					this.getLoopTrait(),
					this.getControlsTrait()];
			},
			/**
			 * Return traits for the source provider
			 * @return {Array<Object>}
			 * @private
			 */
			getYoutubeTraits: function() {
				return [
					this.getProviderTrait(), {
						label: 'Video ID',
						name: 'videoId',
						placeholder: 'eg. jNQXAC9IVRw',
						changeProp: 1,
					},
					this.getAutoplayTrait(),
					this.getLoopTrait(),
					this.getControlsTrait()
				];
			},

			/**
			 * Return traits for the source provider
			 * @return {Array<Object>}
			 * @private
			 */
			getVimeoTraits: function() {
				return [
					this.getProviderTrait(), {
						label: 'Video ID',
						name: 'videoId',
						placeholder: 'eg. 123456789',
						changeProp: 1,
					},{
						label: 'Color',
						name: 'color',
						placeholder: 'eg. FF0000',
						changeProp: 1,
					},
					this.getAutoplayTrait(),
					this.getLoopTrait(),
					this.getControlsTrait()];
			},

			/**
			 * Return object trait
			 * @return {Object}
			 * @private
			 */
			getAutoplayTrait: function(){
				return {
					type: 'checkbox',
					label: 'Autoplay',
					name: 'autoplay',
					changeProp: 1,
				};
			},

			/**
			 * Return object trait
			 * @return {Object}
			 * @private
			 */
			getLoopTrait: function(){
				return {
					type: 'checkbox',
					label: 'Loop',
					name: 'loop',
					changeProp: 1,
				};
			},

			/**
			 * Return object trait
			 * @return {Object}
			 * @private
			 */
			getControlsTrait: function(){
				return {
					type: 'checkbox',
					label: 'Controls',
					name: 'controls',
					changeProp: 1,
				};
			},


			/**
			 * Returns url to youtube video
			 * @return {string}
			 * @private
			 */
			getYoutubeSrc: function() {
				var url = this.get('ytUrl');
				url += this.get('videoId') + '?';
				url += this.get('autoplay') ? '&autoplay=1' : '';
				url += !this.get('controls') ? '&controls=0' : '';
				url += this.get('loop') ? '&loop=1' : '';
				return url;
			},

			/**
			 * Returns url to vimeo video
			 * @return {string}
			 * @private
			 */
			getVimeoSrc: function() {
				var url = this.get('viUrl');
				url += this.get('videoId') + '?';
				url += this.get('autoplay') ? '&autoplay=1' : '';
				url += this.get('loop') ? '&loop=1' : '';
				url += !this.get('controls') ? '&title=0&portrait=0&badge=0' : '';
				url += this.get('color') ? '&color=' + this.get('color') : '';
				return url;
			},

		});
});