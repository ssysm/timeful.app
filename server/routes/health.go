/* The /health group contains health check endpoints for Docker/Kubernetes */
package routes

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"schej.it/server/db"
)

func InitHealth(router *gin.RouterGroup) {
	router.GET("/health", healthCheck)
}

// @Summary Health check endpoint
// @Description Returns the health status of the API and its dependencies
// @Tags health
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 503 {object} map[string]interface{}
// @Router /health [get]
func healthCheck(c *gin.Context) {
	health := gin.H{
		"status": "healthy",
		"checks": gin.H{},
	}

	// Check MongoDB connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := db.Client.Ping(ctx, nil)
	if err != nil {
		health["status"] = "unhealthy"
		health["checks"].(gin.H)["mongodb"] = gin.H{
			"status": "down",
			"error":  err.Error(),
		}
		c.JSON(http.StatusServiceUnavailable, health)
		return
	}

	health["checks"].(gin.H)["mongodb"] = gin.H{
		"status": "up",
	}

	c.JSON(http.StatusOK, health)
}
