package com.example.tapiocariaBackend.controllers

import com.example.tapiocariaBackend.dto.PaymentRequest
import com.example.tapiocariaBackend.repositories.FillingsRepository
import com.example.tapiocariaBackend.repositories.FoodsRepository
import com.example.tapiocariaBackend.repositories.Sales
import com.example.tapiocariaBackend.repositories.SalesRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@CrossOrigin(origins = arrayOf("http://127.0.0.1:5500"))
@RestController
class TapiocariaController(
    val foodsRepository: FoodsRepository,
    val fillingsRepository: FillingsRepository,
    val salesRepository: SalesRepository
){

    @GetMapping("/food")
    fun getFillingsByFoodId(@RequestParam("id") id: Int): ResponseEntity<Any> {
        return try {
            val food = foodsRepository.findById(id).orElseThrow { FoodNotFoundException("Food with id $id not found") }
            val fillings = fillingsRepository.getAllFillingsByFoodId(id)

            ResponseEntity.ok(
                mapOf(
                    "basePrice" to food.price,
                    "fillings" to fillings,
                )
            )
        } catch (e: FoodNotFoundException) {
            ResponseEntity.status(404).body(mapOf("error" to e.message))
        } catch (e: Exception) {
            ResponseEntity.status(500).body(mapOf("error" to "Unexpected error: ${e.message}"))
        }
    }
    @GetMapping("/history")
    fun getAllSalesByCpfClient(@RequestParam("cpf")cpf: String): List<Sales>{
        return salesRepository.getAllSalesByCpfClient(cpf)
    }
    @PostMapping("/payment")
    fun processPayment(@RequestBody paymentRequest: PaymentRequest): ResponseEntity<String>{
        return try {
            val sale = Sales(
                id = null,
                idFood = paymentRequest.idFood,
                cpf = paymentRequest.cpf,
                saleDate = paymentRequest.saleDate,
                description = paymentRequest.description,
                price = paymentRequest.price
            )
            salesRepository.save(sale)

            ResponseEntity.status(201).body("Payment processed successfully!")
        }catch (e: Exception){
            ResponseEntity.badRequest().body("Error processing payment: ${e.message}")
        }
    }
}

class FoodNotFoundException(message: String): RuntimeException(message)
