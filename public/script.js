const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
	el: '#app',
	data: {
		total: 0,
		items: [],
		results: [],
		cart: [],
		newSearch: 'anime',
		lastSearch: '',
		loading: false,
		price: PRICE,
	},
	methods: {
		appendItems() {
			if (this.items.length < this.results.length) {
				const append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
				this.items = this.items.concat(append);
			}
		},
		onSubmit() {
			this.items = [];
			if (this.newSearch.length) {
				this.loading = true;
				axios.get(`/search/${this.newSearch}`).then((response) => {
					this.results = response.data;
					this.lastSearch = this.newSearch;
					this.appendItems();
					this.loading = false;
				});
			}
		},

		addItem(index) {
			let addItemCart = false;
			let item = this.items[index];
			this.total += PRICE;
			for( let i = 0; i < this.cart.length; i++) {
				if(this.cart[i].id === item.id) {
					this.cart[i].qty++;
					addItemCart = true;
					break;
				}
			}
			if (!addItemCart) {
				this.cart.push({
					id: item.id,
					title: item.title,
					qty: 1,
					price: PRICE
				});
				this.items[index].qty++;
			}
		},

		inc(item) {
			item.qty++;
			this.total += PRICE;
		},

		dec(item) {
			item.qty--;
			this.total -= PRICE;
			if (item.qty <= 0) {
				for (let i = 0; i < this.cart.length; i++) {
					if (this.cart[i].id === item.id) {
						this.cart.splice(i, 1);
						break;
					}
				}
			}
		}
	},
	computed: {
		noMoreItems() {
			return this.items.length === this.results.length && this.results.length > 0;
		}
	},
	filters: {
		currency(price) {
			return '$'.concat(price.toFixed(2));
		}
	},
	mounted() {
		this.onSubmit();
		
		const elem = document.getElementById("product-list-bottom");
		const watcher = scrollMonitor.create(elem);
		watcher.enterViewport(() => {
			this.appendItems();
		})
	}
});