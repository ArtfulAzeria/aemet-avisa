// Reset formatting
const RESET = "\x1b[0m";

// Text styles
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const ITALIC = "\x1b[3m";
const UNDERLINE = "\x1b[4m";
const BLINK = "\x1b[5m";
const REVERSE = "\x1b[7m";
const HIDDEN = "\x1b[8m";

// Regular text colors
const BLACK = "\x1b[30m";
export const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const BLUE = "\x1b[34m";
const MAGENTA = "\x1b[35m";
const CYAN = "\x1b[36m";
const WHITE = "\x1b[37m";

// Bright text colors
const BRIGHT_BLACK = "\x1b[90m";
const BRIGHT_RED = "\x1b[91m";
const BRIGHT_GREEN = "\x1b[92m";
const BRIGHT_YELLOW = "\x1b[93m";
const BRIGHT_BLUE = "\x1b[94m";
const BRIGHT_MAGENTA = "\x1b[95m";
const BRIGHT_CYAN = "\x1b[96m";
const BRIGHT_WHITE = "\x1b[97m";

// Background colors
const BG_BLACK = "\x1b[40m";
const BG_RED = "\x1b[41m";
const BG_GREEN = "\x1b[42m";
const BG_YELLOW = "\x1b[43m";
const BG_BLUE = "\x1b[44m";
const BG_MAGENTA = "\x1b[45m";
const BG_CYAN = "\x1b[46m";
const BG_WHITE = "\x1b[47m";

// Bright background colors
const BG_BRIGHT_BLACK = "\x1b[100m";
const BG_BRIGHT_RED = "\x1b[101m";
const BG_BRIGHT_GREEN = "\x1b[102m";
const BG_BRIGHT_YELLOW = "\x1b[103m";
const BG_BRIGHT_BLUE = "\x1b[104m";
const BG_BRIGHT_MAGENTA = "\x1b[105m";
const BG_BRIGHT_CYAN = "\x1b[106m";
const BG_BRIGHT_WHITE = "\x1b[107m";

// Log levels
export const log = {
    DBUG: `year-left ${BRIGHT_MAGENTA}|${RESET}`,
    INFO: `year-left ${CYAN}|${RESET}`,
    WARN: `year-left ${YELLOW}|${RESET}`,
    ERRR: `year-left ${RED}|${RESET}`,
    SCES: `year-left ${GREEN}|${RESET}`
};

// Utility functions
export const util = {
    bold: (text: string) => `${BOLD}${text}${RESET}`,
    dim: (text: string) => `${DIM}${text}${RESET}`,
    italic: (text: string) => `${ITALIC}${text}${RESET}`,
    underline: (text: string) => `${UNDERLINE}${text}${RESET}`,
    blink: (text: string) => `${BLINK}${text}${RESET}`,
    reverse: (text: string) => `${REVERSE}${text}${RESET}`,
    hidden: (text: string) => `${HIDDEN}${text}${RESET}`
};

export const color = {
    red: (text: string) => `${RED}${text}${RESET}`,
    green: (text: string) => `${GREEN}${text}${RESET}`,
    yellow: (text: string) => `${YELLOW}${text}${RESET}`,
    blue: (text: string) => `${BLUE}${text}${RESET}`,
    magenta: (text: string) => `${MAGENTA}${text}${RESET}`,
    cyan: (text: string) => `${CYAN}${text}${RESET}`,
    white: (text: string) => `${WHITE}${text}${RESET}`
};