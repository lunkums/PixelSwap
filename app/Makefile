SRC_DIR := src
BUILD_DIR := build

OUT := $(BUILD_DIR)/pixel-swap.js
SRC := $(SRC_DIR)/Main.cpp $(SRC_DIR)/Color.cpp

OPTFLAGS := -O3 -sALLOW_MEMORY_GROWTH=1 
EXPFLAGS := -sEXPORTED_RUNTIME_METHODS=ccall -sEXPORTED_FUNCTIONS=_main,_SwapColors,_free

.PHONY: all clean

all: $(OUT)

$(OUT): $(BUILD_DIR)
	emcc $(SRC) -o $(OUT) $(OPTFLAGS) $(EXPFLAGS)

$(BUILD_DIR):
	mkdir -p $@

clean:
	@$(RM) -rv $(BUILD_DIR)
