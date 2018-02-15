const PRICE = 9.99;

new Vue({
	el: '#app',
	data: {
		total: 0,
		items: [],
		cart: [],
		newSearch: 'anime',
		lastSearch: '',
		loading: false,
		price: PRICE,
	},
	methods: {
		onSubmit() {
			this.items = [];
			this.loading = true;
			axios.get(`/search/${this.newSearch}`).then((response) => {
				this.items = response.data;
				this.lastSearch = this.newSearch;
				this.loading = false;
			});
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
	filters: {
		currency(price) {
			return '$'.concat(price.toFixed(2));
		}
	},
	mounted() {
		this.onSubmit();
	}
});