Rem This is an example script

@echo off
set /p number_one=Enter first number: 
set /p number_two=Enter second number: 
set /a Ans=%number_one% + %number_two%

echo %number_one% + %number_two% = %Ans%
pause
exit 0