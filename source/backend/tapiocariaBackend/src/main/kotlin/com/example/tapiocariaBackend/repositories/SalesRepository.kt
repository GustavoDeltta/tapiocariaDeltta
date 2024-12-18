package com.example.tapiocariaBackend.repositories

import com.example.tapiocariaBackend.dto.SaleResponse
import jakarta.persistence.*
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

@Entity
@Table(name = "sales")
data class Sales(

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id val id: Int?,

    @ManyToOne
    @JoinColumn(name = "id_food", referencedColumnName = "id")
    val food: Foods, // Relação com a tabela foods

    val cpf: String,
    val saleDate: String,
    val description: String,
    val price: Float
)

interface SalesRepository: JpaRepository<Sales, Int> {
    @Query("""
    SELECT new com.example.tapiocariaBackend.dto.SaleResponse(f.name, s.price, s.saleDate, s.description)
    FROM Sales s
    JOIN s.food f
    WHERE s.cpf = :cpf
""")
    fun getAllSalesByCpfClient(@Param("cpf") cpf: String): List<SaleResponse>
}