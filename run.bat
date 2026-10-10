@echo off
title Indian Industry Trend Tracker
echo ======================================================================
echo Launching Indian Industry Trend Tracker
echo Direct Yahoo Finance Connection (Zero Proxies / High Speed)
echo ======================================================================

:: Launch Microsoft Edge (built-in on Windows) with direct CORS bypass
start msedge --disable-web-security --user-data-dir="%TEMP%\edge_stock_tracker" "%~dp0index.html"

exit
