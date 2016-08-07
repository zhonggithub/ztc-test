<script>
export default {
    props: {
        'wrapperClass': {
            type: String,
            default: function() {
                return 'ui right floated pagination menu'
            }
        },
        'disabledClass': {
            type: String,
            default: function() {
                return 'disabled'
            }
        },
        'pageClass': {
            type: String,
            default: function() {
                return 'item'
            }
        },
        'linkClass': {
            type: String,
            default: function() {
                return 'icon item'
            }
        },
        'icons': {
            type: Object,
            default: function() {
                return {
                    prev: 'left chevron icon',
                    next: 'right chevron icon'
                }
            }
        }
    },
    data: function() {
        return {
            tablePagination: null,
            currentPage: 1
        }
    },
    watch: {},
    computed: {
        totalPage: function() {
            return this.tablePagination == null ? 0 : this.tablePagination.last_page
        },
        isOnFirstPage: function() {
            return this.tablePagination == null ? false : this.tablePagination.current_page == 1
        },
        isOnLastPage: function() {
            return this.tablePagination == null ? false : this.tablePagination.current_page == this.tablePagination.last_page
        },
        pageRange: function() {
            var totalPage = this.tablePagination == null ? 0 : this.tablePagination.last_page;
            var iListLength = 5,
                iHalf = Math.floor(iListLength / 2);
            var iStart, iEnd;
            var currentPage = this.tablePagination == null ? 1 : this.tablePagination.current_page;

            if (totalPage < iListLength) {
                iStart = 1;
                iEnd = totalPage;
            } else if (currentPage <= iHalf) {
                iStart = 1;
                iEnd = iListLength;
            } else if (currentPage >= (totalPage - iHalf)) {
                iStart = totalPage - iListLength + 1;
                iEnd = totalPage;
            } else {
                iStart = currentPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }
            var result = [];
            for (var i = iStart; i <= iEnd; i++) {
                result.push(i - 1);
            }
            return result;
        }
    },
    methods: {
        loadPage: function(page) {
            this.currentPage = page;
            this.$dispatch('vuetable-pagination:change-page', page)
        },
        isCurrentPage: function(page) {
            return page == this.tablePagination.current_page
        },
        currentPageChange: function() {
            if (!parseInt(this.currentPage)) {
                return;
            }
            this.$dispatch('vuetable-pagination:change-page', this.currentPage);
        }
    },
    events: {
        'vuetable:load-success': function(tablePagination) {
            this.tablePagination = tablePagination
            this.currentPage = tablePagination.current_page;
        },
        'vuetable-pagination:set-options': function(options) {
            for (var n in options) {
                this.$set(n, options[n])
            }
        }
    },
}
</script>
