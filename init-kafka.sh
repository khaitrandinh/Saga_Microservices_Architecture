#!/bin/bash
# Wait for Kafka to be ready
sleep 10

# Create topics
kafka-topics --create --topic order-topic --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1
kafka-topics --create --topic inventory-topic --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1
kafka-topics --create --topic payment-topic --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1
kafka-topics --create --topic product-topic --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1
kafka-topics --create --topic dead-letter-topic --bootstrap-server kafka:9092 --replication-factor 1 --partitions 1

