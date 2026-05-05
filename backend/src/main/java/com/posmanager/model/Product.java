package com.posmanager.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "products")
@Data
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String sku;
    private String category;
    private int stock;
    private double purchasePrice;
    private double sellingPrice;
    private String unit;
    private String image;
    private String barcode;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;
}
