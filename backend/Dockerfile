# Dockerfile OPCIONAL: el backend no depende de Docker para ejecutarse
# (ver README.md -> "Ejecutar sin Docker"). Esta imagen es una via alternativa
# de despliegue (Render, Railway, Fly.io, etc.) para quien prefiera desplegar
# como contenedor en lugar de un JAR desnudo.

FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine AS run
WORKDIR /app
RUN addgroup -S norda && adduser -S norda -G norda
COPY --from=build /build/target/norda-backend.jar app.jar
USER norda
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
