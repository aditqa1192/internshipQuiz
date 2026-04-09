import { useEffect, useState } from "react";
import { Box, Button, FormControlLabel, Paper, Switch, TextField, Typography } from "@mui/material";
import AdminLayout from "../../components/AdminLayout";
import { adminFetch } from "../../utils/adminApi";

function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await adminFetch("/api/admin/settings");
        const payload = await response.json();
        setSettings(payload.settings);
      } catch (err) {
        setError(err.message);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify(settings),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Unable to save settings");
      }
      setSettings(payload.settings);
      setMessage("Settings updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!settings) {
    return (
      <AdminLayout title="Settings">
        <Typography>Loading settings…</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Settings">
      <Paper sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "grid", gap: 3 }}>
          <FormControlLabel
            control={<Switch checked={settings.quizOpen} onChange={(event) => setSettings((prev) => ({ ...prev, quizOpen: event.target.checked }))} />}
            label="Quiz open for students"
          />

          <FormControlLabel
            control={<Switch checked={settings.oneAttempt} onChange={(event) => setSettings((prev) => ({ ...prev, oneAttempt: event.target.checked }))} />}
            label="Enforce one attempt per student"
          />

          <TextField
            label="Time limit (minutes)"
            type="number"
            value={settings.timeLimitMinutes}
            onChange={(event) => setSettings((prev) => ({ ...prev, timeLimitMinutes: Number(event.target.value) }))}
            inputProps={{ min: 1, step: 1 }}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button variant="contained" onClick={handleSave} disabled={loading}>
              {loading ? "Saving…" : "Save settings"}
            </Button>
            {message && (
              <Typography color="success.main" sx={{ alignSelf: "center" }}>
                {message}
              </Typography>
            )}
            {error && (
              <Typography color="error.main" sx={{ alignSelf: "center" }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </AdminLayout>
  );
}

export default SettingsPage;
