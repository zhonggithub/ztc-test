<template>
    <ul class="pagination">
        <li class="{{isOnFirstPage ? disabledClass : ''}}">
            <a @click="loadPage('first')"><i class="fa fa-angle-double-left"></i></a>
        </li>
        <li class="{{isOnFirstPage ? disabledClass : ''}}">
            <a @click="loadPage('prev')"><i class="fa fa-angle-left"></i></a>
        </li>
        <template v-for="n in pageRange">
            <li class="{{isCurrentPage(n+1) ? ' active' : ''}}">
                <a @click="loadPage(n+1)"> {{ n+1 }}</a>
            </li>
        </template>
        <li class="{{isOnLastPage ? disabledClass : ''}}">
            <a @click="loadPage('next')"><i class="fa fa-angle-right"></i></a>
        </li>
        <li class="{{isOnLastPage ? disabledClass : ''}}">
            <a @click="loadPage('last')"><i class="fa fa-angle-double-right"></i></a>
        </li>
        <li>
            <div class="input-group input-inline input-small pull-right" style=" padding-left: 20px;">
                <input type="text" class="form-control input-xsmall pull-left" v-on:keyup.enter="currentPageChange" v-model="currentPage">
                <span class="input-group-btn pull-left">
                    <button class="btn blue" v-on:click="currentPageChange" type="button">Go</button>
                </span>
            </div>
        </li>
    </ul>
</template>
<script>
import PaginationMixin from './VuetablePaginationMixin.vue'

export default {
    mixins: [PaginationMixin],
    methods: {
        loadPage: function(page) {
            this.$dispatch('vuetable-pagination:change-page', page)
        }
    },
}
</script>
