/* The /config endpoint exposes server configuration for self-hosted deployments */
package routes

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func InitConfig(router *gin.RouterGroup) {
	router.GET("/config", getConfig)
}

// @Summary Get server configuration
// @Description Returns configuration settings for the frontend (self-hosted mode, etc.)
// @Tags config
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /config [get]
func getConfig(c *gin.Context) {
	selfHostedMode := os.Getenv("SELF_HOSTED_MODE") == "true"
	requireAuthForEvents := os.Getenv("REQUIRE_AUTH_FOR_EVENTS") == "true"

	c.JSON(http.StatusOK, gin.H{
		"selfHostedMode":       selfHostedMode,
		"requireAuthForEvents": requireAuthForEvents,
	})
}
