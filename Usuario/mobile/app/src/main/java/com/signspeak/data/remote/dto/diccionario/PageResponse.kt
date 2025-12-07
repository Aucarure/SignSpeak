package com.signspeak.data.remote.dto.diccionario

// Agregamos <T> aquí para que la clase sea genérica
data class PageResponse<T>(
    val content: List<T>, // Ahora la lista es del tipo genérico T
    val pageable: PageableInfo,
    val last: Boolean,
    val totalPages: Int,
    val totalElements: Long,
    val size: Int,
    val number: Int,
    val sort: SortInfo,
    val first: Boolean,
    val numberOfElements: Int,
    val empty: Boolean
)

data class PageableInfo(
    val sort: SortInfo,
    val offset: Long,
    val pageNumber: Int,
    val pageSize: Int,
    val paged: Boolean,
    val unpaged: Boolean
)

data class SortInfo(
    val empty: Boolean,
    val sorted: Boolean,
    val unsorted: Boolean
)