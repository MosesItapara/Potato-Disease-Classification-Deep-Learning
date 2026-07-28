import { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import LinearProgress from "@mui/material/LinearProgress";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import SpaRoundedIcon from "@mui/icons-material/SpaRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import farmScene from "./assets/farm-scene.jpg";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/predict";

const CLASS_INFO = {
  Healthy: { color: "#5fae6b", icon: SpaRoundedIcon, desc: "No signs of disease detected." },
  "Early Blight": { color: "#e0a53e", icon: WarningAmberRoundedIcon, desc: "Fungal infection, early stage." },
  "Late Blight": { color: "#d9603f", icon: ErrorOutlineRoundedIcon, desc: "Aggressive infection, needs attention." },
};

const theme = createTheme({
  palette: {
    primary: { main: "#3d5c3a" },
  },
  shape: { borderRadius: 20 },
  typography: {
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  },
});

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview || !selectedFile) return;

    const sendFile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const res = await axios.post(API_URL, formData);
        setData(res.data);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    sendFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview]);

  const onSelectFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    setData(null);
    setError(null);
    setSelectedFile(file);
  };

  const clearData = () => {
    setSelectedFile(null);
    setPreview(null);
    setData(null);
    setError(null);
  };

  const confidence = data ? parseFloat(data.confidence) * 100 : 0;
  const info = data ? CLASS_INFO[data.predicted_class] : null;
  const ResultIcon = info?.icon;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
        <Box
          component="img"
          src={farmScene}
          alt=""
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "blur(14px)",
            transform: "scale(1.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(20,26,18,0.45) 0%, rgba(20,26,18,0.2) 35%, rgba(20,26,18,0.55) 100%)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 20px",
            boxSizing: "border-box",
          }}
        >
          <Stack direction="row" spacing={1} sx={{ mb: { xs: 4, sm: 6 }, alignItems: "center" }}>
            <SpaRoundedIcon sx={{ color: "#fff", fontSize: 26 }} />
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: 0.2 }}>
              Leaf Doctor
            </Typography>
          </Stack>

          <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <Grow in timeout={500}>
              <Box
                sx={{
                  width: "min(92vw, 420px)",
                  borderRadius: "28px",
                  background: alpha("#ffffff", 0.14),
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                  padding: "36px 32px",
                  boxSizing: "border-box",
                  color: "#fff",
                }}
              >
                {!selectedFile && (
                  <Fade in timeout={400}>
                    <Box
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        onSelectFile(e.dataTransfer.files[0]);
                      }}
                      onClick={() => document.getElementById("file-input").click()}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        padding: "36px 12px",
                        borderRadius: "20px",
                        border: "1.5px dashed",
                        borderColor: isDragging ? "#fff" : "rgba(255,255,255,0.4)",
                        backgroundColor: isDragging ? "rgba(255,255,255,0.08)" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => onSelectFile(e.target.files[0])}
                      />
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(255,255,255,0.15)",
                        }}
                      >
                        <CloudUploadRoundedIcon sx={{ fontSize: 30, color: "#fff" }} />
                      </Box>
                      <Typography sx={{ fontWeight: 600, fontSize: 17, textAlign: "center" }}>
                        Drop a potato leaf photo
                      </Typography>
                      <Typography sx={{ fontSize: 14, opacity: 0.75, textAlign: "center" }}>
                        or click to browse your files
                      </Typography>
                    </Box>
                  </Fade>
                )}

                {selectedFile && (
                  <Fade in timeout={400}>
                    <Box>
                      <Box
                        sx={{
                          position: "relative",
                          borderRadius: "18px",
                          overflow: "hidden",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        }}
                      >
                        <Box
                          component="img"
                          src={preview}
                          alt="Selected leaf"
                          sx={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
                        />
                        {!isLoading && (
                          <IconButton
                            onClick={clearData}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 10,
                              right: 10,
                              backgroundColor: "rgba(0,0,0,0.45)",
                              color: "#fff",
                              "&:hover": { backgroundColor: "rgba(0,0,0,0.65)" },
                            }}
                          >
                            <RefreshRoundedIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>

                      {isLoading && (
                        <Stack spacing={1.5} sx={{ mt: 3, alignItems: "center" }}>
                          <CircularProgress size={28} sx={{ color: "#fff" }} />
                          <Typography sx={{ fontSize: 14, opacity: 0.85 }}>
                            Analyzing leaf...
                          </Typography>
                        </Stack>
                      )}

                      {error && !isLoading && (
                        <Box sx={{ mt: 3, textAlign: "center" }}>
                          <Typography sx={{ color: "#ffb4a8", fontSize: 14, mb: 1.5 }}>
                            {error}
                          </Typography>
                          <Chip
                            label="Try again"
                            onClick={clearData}
                            sx={{
                              color: "#fff",
                              borderColor: "rgba(255,255,255,0.4)",
                              backgroundColor: "transparent",
                            }}
                            variant="outlined"
                          />
                        </Box>
                      )}

                      {data && !isLoading && info && (
                        <Fade in timeout={500}>
                          <Box sx={{ mt: 3 }}>
                            <Stack direction="row" spacing={1.2} sx={{ mb: 1.5, alignItems: "center" }}>
                              <Box
                                sx={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: "50%",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  backgroundColor: alpha(info.color, 0.22),
                                }}
                              >
                                <ResultIcon sx={{ color: info.color, fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: 19, lineHeight: 1.1 }}>
                                  {data.predicted_class}
                                </Typography>
                                <Typography sx={{ fontSize: 13, opacity: 0.75 }}>
                                  {info.desc}
                                </Typography>
                              </Box>
                            </Stack>

                            <Stack
                              direction="row"
                              sx={{ fontSize: 13, opacity: 0.8, mb: 0.5, justifyContent: "space-between" }}
                            >
                              <span>Confidence</span>
                              <span>{confidence.toFixed(1)}%</span>
                            </Stack>
                            <LinearProgress
                              variant="determinate"
                              value={confidence}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: "rgba(255,255,255,0.18)",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: info.color,
                                  borderRadius: 4,
                                },
                              }}
                            />

                            <Stack direction="row" spacing={1} sx={{ mt: 2.5, flexWrap: "wrap", gap: 1 }}>
                              {Object.entries(CLASS_INFO).map(([label, meta]) => {
                                const active = label === data.predicted_class;
                                return (
                                  <Chip
                                    key={label}
                                    label={label}
                                    size="small"
                                    sx={{
                                      color: active ? "#fff" : "rgba(255,255,255,0.6)",
                                      backgroundColor: active ? alpha(meta.color, 0.35) : "transparent",
                                      border: `1px solid ${active ? meta.color : "rgba(255,255,255,0.25)"}`,
                                      fontWeight: active ? 700 : 500,
                                    }}
                                  />
                                );
                              })}
                            </Stack>
                          </Box>
                        </Fade>
                      )}
                    </Box>
                  </Fade>
                )}
              </Box>
            </Grow>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
