package com.example.tapiocariaBackend.repositories

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

@Entity
@Table(name = "fillings")
data class Fillings (
    @Id val id: Int,
    val id_food: Int,
    val name: String,
    val price: Float
)

interface FillingsRepository: JpaRepository<Fillings, Int> {
    @Query("select name, price from fillings where id_food = :id", nativeQuery = true)
    fun getAllFillingsByFoodId(@Param("id")id: Int): List<Map<String, Float>>
}