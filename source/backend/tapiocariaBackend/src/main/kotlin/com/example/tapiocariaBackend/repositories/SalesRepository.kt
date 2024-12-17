package com.example.tapiocariaBackend.repositories

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

@Entity
@Table(name = "sales")
data class Sales(
    @Id val id: Int?,
    val idFood: Int,
    val cpf: String,
    val saleDate: String,
    val description: String,
    val price: Float
)

interface SalesRepository: JpaRepository<Sales, Int> {
    @Query("select * from sales where cpf = :cpf", nativeQuery = true)
    fun getAllSalesByCpfClient(@Param("cpf")cpf: String): List<Sales>
}