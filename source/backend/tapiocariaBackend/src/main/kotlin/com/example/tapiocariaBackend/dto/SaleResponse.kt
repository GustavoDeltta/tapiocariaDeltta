package com.example.tapiocariaBackend.dto

data class SaleResponse(
    val foodName: String,
    val price: Float,
    val saleDate: String,
    val description: String
)
