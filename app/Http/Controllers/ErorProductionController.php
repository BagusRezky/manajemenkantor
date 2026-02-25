<?php

namespace App\Http\Controllers;

use App\Imports\ErorProductionImport;
use App\Models\ErorProduction;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ErorProductionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $erorProductions = ErorProduction::all();
        return Inertia::render('erorProduction/erorProductions', [
            'erorProductions' => $erorProductions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ErorProduction $erorProduction)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ErorProduction $erorProduction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ErorProduction $erorProduction)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ErorProduction $erorProduction)
    {
        //
    }

    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls,csv'
        ]);

        Excel::import(new ErorProductionImport, $request->file('file'));

        return redirect()->route('erorProductions.index')->with('success', 'Data eror productions berhasil diimport dari Excel.');
    }


}
