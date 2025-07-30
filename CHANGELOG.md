# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2024-07-30 - Code Quality & Documentation Updates

### Fixed
- **ESLint Configuration**: Resolved all linting errors and improved code quality
- **Code Formatting**: Applied Prettier formatting across all TypeScript files
- **Unused Variables**: Fixed unused parameter warnings with proper TypeScript conventions
- **Repository Links**: Updated all GitHub repository URLs to correct location
- **Navigation Links**: Fixed README navigation links for proper section scrolling

### Improved
- **Documentation**: Enhanced README with better navigation and equities information
- **Code Standards**: Implemented professional TypeScript coding standards
- **Build Process**: Optimized build and linting workflows
- **Package Metadata**: Updated repository, homepage, and issues URLs

### Technical
- **ESLint Rules**: Configured proper TypeScript ESLint rules with unused parameter handling
- **Prettier Integration**: Seamless code formatting with ESLint integration
- **Type Safety**: Maintained strict TypeScript compliance throughout

## [1.0.2] - 2024-07-30 - Documentation & Navigation Fixes

### Fixed
- **README Navigation**: Fixed anchor links for proper section navigation
- **Asset Classes**: Added equities to supported asset classes documentation

### Updated
- **Header**: Changed main header to "🚀 TradingView Screener API"
- **Documentation**: Improved clarity and organization

## [1.0.1] - 2024-07-30 - Repository Setup

### Added
- **GitHub Integration**: Proper repository linking and metadata
- **Package Distribution**: NPM package publishing setup

## [1.0.0] - 2024-01-XX - Initial Release of tradingview-screener-ts

### Added

- **Complete TypeScript port** of the Python TradingView Screener library
- **Full type definitions** for all classes, interfaces, and methods
- **Async/await support** for all data fetching operations
- **Modern JavaScript/TypeScript features** and conventions
- **Comprehensive test suite** with Jest
- **ESLint and Prettier** configuration for code quality
- **TypeDoc documentation** generation
- **GitHub Actions CI/CD** pipeline
- **NPM package** distribution

### Core Features

- `Query` class with fluent API for building screener queries
- `Column` class with 30+ filtering operations
- `And`/`Or` logical operators for complex filtering
- Support for 3000+ TradingView fields with comprehensive documentation
- Multiple market support (67+ countries, crypto, forex, etc.)
- **India Stock Market**: Dedicated support with INR currency formatting
- **Regional Screeners**: Pre-built screeners for India, US, and Global markets
- Real-time data access with session cookies
- Percentage-based comparisons
- Technical analysis operations
- Date range filtering
- Pattern matching
- Set operations for array fields

### API Methods

- `select()` - Choose columns to retrieve
- `where()` - Add filters with AND logic
- `where2()` - Advanced filtering with AND/OR logic
- `orderBy()` - Sort results
- `limit()` - Limit number of results
- `offset()` - Skip results for pagination
- `setMarkets()` - Choose markets/exchanges
- `setTickers()` - Filter specific tickers
- `setIndex()` - Filter by index components
- `getScannerData()` - Get structured results
- `getScannerDataRaw()` - Get raw API response

### Field Documentation & Regional Support

- **Complete Field References**: Links to all TradingView field documentation
  - [Stocks Fields](https://shner-elmo.github.io/TradingView-Screener/fields/stocks.html) - 3000+ stock fields
  - [Crypto Fields](https://shner-elmo.github.io/TradingView-Screener/fields/crypto.html) - Cryptocurrency fields
  - [Forex Fields](https://shner-elmo.github.io/TradingView-Screener/fields/forex.html) - Currency pair fields
  - [Futures Fields](https://shner-elmo.github.io/TradingView-Screener/fields/futures.html) - Futures contract fields
  - [Options Fields](https://shner-elmo.github.io/TradingView-Screener/fields/options.html) - Options contract fields
  - [Bonds Fields](https://shner-elmo.github.io/TradingView-Screener/fields/bonds.html) - Bond screening fields
  - [Economics Fields](https://shner-elmo.github.io/TradingView-Screener/fields/economics2.html) - Economic indicators

- **Regional Stock Screeners**: Pre-built screener documentation
  - [🇮🇳 India Stocks Screener](https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/india.html) - Complete India market screening
  - [🇺🇸 US Stocks Screener](https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/america.html) - US market screening
  - [🌐 Global Stocks Screener](https://shner-elmo.github.io/TradingView-Screener/screeners/stocks/global.html) - Multi-market screening

### India Market Features

- **Currency Support**: INR (₹) formatting for Indian stocks
- **Market-Specific Thresholds**: Appropriate filters for Indian market caps and volumes
- **NSE/BSE Coverage**: Complete Indian stock exchange support
- **India Examples**: Dedicated code examples for Indian stock screening

### Column Operations

- Comparison: `gt()`, `gte()`, `lt()`, `lte()`, `eq()`, `ne()`
- Range: `between()`, `notBetween()`, `isin()`, `notIn()`
- Percentage: `abovePct()`, `belowPct()`, `betweenPct()`, `notBetweenPct()`
- Set: `has()`, `hasNoneOf()`
- Pattern: `like()`, `notLike()`
- Null: `empty()`, `notEmpty()`
- Technical: `crosses()`, `crossesAbove()`, `crossesBelow()`
- Date: `inDayRange()`, `inWeekRange()`, `inMonthRange()`

### Developer Experience

- **TypeScript IntelliSense** with full autocomplete
- **Comprehensive JSDoc** documentation
- **Type-safe API** prevents runtime errors
- **Modern async/await** syntax
- **Promise-based** architecture
- **Error handling** with detailed error messages

### Testing

- **100% test coverage** of core functionality
- **Integration tests** with live API calls
- **Unit tests** for all classes and methods
- **Mock support** for testing without API calls
- **Continuous Integration** with GitHub Actions

### Documentation

- **Comprehensive README** with examples
- **Migration guide** from Python version
- **API reference** documentation
- **Real-time data** usage examples
- **TypeScript examples** for all features

### Build & Distribution

- **TypeScript compilation** to JavaScript
- **ES modules** and CommonJS support
- **NPM package** with proper metadata
- **Source maps** for debugging
- **Declaration files** for TypeScript users
- **Tree-shaking** support for smaller bundles

### Dependencies

- `axios` - HTTP client for API requests
- `tough-cookie` - Cookie handling support

### Development Dependencies

- `typescript` - TypeScript compiler
- `jest` - Testing framework
- `eslint` - Code linting
- `prettier` - Code formatting
- `typedoc` - Documentation generation
- `ts-jest` - TypeScript support for Jest

### Breaking Changes from Python Version

- **Method names**: Changed from `snake_case` to `camelCase`
- **Async operations**: All data fetching is now asynchronous
- **Return format**: Returns objects instead of tuples
- **Comparison operators**: Use methods instead of operator overloading
- **Constructor syntax**: Requires `new` keyword for classes
- **Import syntax**: ES modules instead of Python imports

### Migration Support

- **Detailed migration guide** with side-by-side examples
- **API mapping table** for all method name changes
- **Common pitfalls** documentation
- **Performance considerations** guide

### Examples

- **Basic usage** examples
- **Advanced filtering** examples
- **Real-time data** access examples
- **Multi-market** querying examples
- **Technical analysis** examples
- **Error handling** examples

### Quality Assurance

- **ESLint** configuration with TypeScript rules
- **Prettier** for consistent code formatting
- **Husky** git hooks for pre-commit checks
- **Jest** for comprehensive testing
- **TypeScript strict mode** for maximum type safety

### Performance

- **Optimized bundle size** with tree-shaking
- **Efficient HTTP requests** with axios
- **Memory-efficient** data structures
- **Fast JSON parsing** with native JavaScript
- **Minimal dependencies** for smaller footprint

### Browser Support

- **Node.js 16+** support
- **Modern browsers** with ES2020 support
- **Webpack/Rollup** compatibility
- **React/Vue/Angular** integration ready

### Future Roadmap

- WebSocket support for real-time streaming
- Additional technical indicators
- Chart pattern recognition
- Portfolio optimization features
- Machine learning integration
- GraphQL API support

---

## Migration from Python Version

This TypeScript version maintains 100% feature parity with the Python version while providing:

1. **Better Developer Experience** with TypeScript
2. **Modern JavaScript** features and conventions
3. **Comprehensive Type Safety**
4. **Async/Await** support
5. **NPM Ecosystem** integration
6. **Browser Compatibility**

See [MIGRATION.md](MIGRATION.md) for detailed migration instructions.

---

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Original Python implementation by [shner-elmo](https://github.com/shner-elmo)
- TradingView for providing the API
- TypeScript community for excellent tooling
- All contributors and users of the library
