import Parser from '../../searchseco/searchSECO-parser/Parser'
import HashData from '../../searchseco/searchSECO-parser/HashData'


describe('The parser', () => {

    const results = {
        "js": <HashData[]>[],
        "python": <HashData[]>[],
        "cpp": <HashData[]>[]
    }

    beforeAll(async () => {
        results["js"] = (await Parser.ParseFiles({ files: [ 'tests/parser/to_parse/a.js' ] })).result
        results["python"] = (await Parser.ParseFiles({ files: [ 'tests/parser/to_parse/a.py' ] })).result
        results["cpp"] = (await Parser.ParseFiles({ files: [ 'tests/parser/to_parse/a.cpp' ] })).result
    })

    describe("extracts correct function hashes from", () => {
        test('a javascript file', async () => {
            const resultMap = {
                "test": {
                    Hash: "cae02f5f0917dbd5f5c1a1434bb78b11"
                },
                "mult": {
                    Hash: "b4e156d5abd7783bc3f69d868d49498f" 
                },
                "<anonymous>": { 
                    Hash: "e2c1d84261aa52d495ac31b5b07e9ce7"
                }
            }
    
            results["js"].forEach((r: HashData) => {
                expect(r.Hash).toBe(resultMap[r.FunctionName as keyof typeof resultMap].Hash)
            })
        })

        test('a python file', () => {
            const resultMap = {
                "test": { 
                    Hash: "0e5c70fbbd0fad6e518eb6e715c95043" 
                },
                "mult": { 
                    Hash: "b530d6067cdedb1a971647bccefb68df"
                },
            }
            results["python"].forEach((r: HashData) => {
                expect(r.Hash).toBe(resultMap[r.FunctionName as keyof typeof resultMap].Hash)
            })
        })

        test('a cpp file', () => {
            const resultMap = {
                "main": {
                    Hash: "2fb63ed9e80d5b0b592d8ed77360e034"
                },
                "test": {
                    Hash: "87c0b95dd6809eb25d88182619a67cc3" 
                },
                "multiply": { 
                    Hash: "74575f74059e69eda6903e280881dd0e"
                }
            }
            results["cpp"].forEach((r: HashData) => {
                expect(r.Hash).toBe(resultMap[r.FunctionName as keyof typeof resultMap].Hash)
            })
        })

        // test('a csharp file', () => {

        // })

        // test('a java file', () => {
            
        // })
    })



})


