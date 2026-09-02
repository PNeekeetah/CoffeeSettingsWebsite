#!/data/data/com.termux/files/usr/bin/bash
set -e

# ============================================================
# Sets up Postgres + backend as auto-restarting Termux services
# using runit (via termux-services), with termux-boot persistence.
# Run this from anywhere inside Termux (not inside proot).
# ============================================================

BACKEND_DIR="$HOME/git/CoffeeSettingsWebsite/backend"

echo "==> Installing termux-services and ..."
pkg install -y termux-services

echo "==> NOTE: If this is the first time installing termux-services,"
echo "    you must close and reopen Termux now, then re-run this script."
echo "    (runit's service directory only loads in a fresh session.)"
read -p "Press Enter once you've confirmed sv/sv-enable commands work (or Ctrl+C to stop here)..." _

# ---- Postgres service ----
echo "==> Setting up postgres service..."
mkdir -p "$PREFIX/var/service/postgres/log"

cat > "$PREFIX/var/service/postgres/run" << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
exec postgres -D $PREFIX/var/lib/postgresql
EOF

cat > "$PREFIX/var/service/postgres/log/run" << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
exec svlogd -tt $PREFIX/var/log/postgres
EOF

chmod +x "$PREFIX/var/service/postgres/run"
chmod +x "$PREFIX/var/service/postgres/log/run"

# ---- Backend service ----
echo "==> Setting up backend service..."
mkdir -p "$PREFIX/var/service/backend/log"

cat > "$PREFIX/var/service/backend/run" << EOF
#!/data/data/com.termux/files/usr/bin/sh
sleep 5
cd $BACKEND_DIR
exec .venv/bin/python3 main.py
EOF

cat > "$PREFIX/var/service/backend/log/run" << 'EOF'
#!/data/data/com.termux/files/usr/bin/sh
exec svlogd -tt $PREFIX/var/log/backend
EOF

chmod +x "$PREFIX/var/service/backend/run"
chmod +x "$PREFIX/var/service/backend/log/run"

# ---- Enable both services now ----
echo "==> Enabling services..."
sv-enable postgres
sv-enable backend
