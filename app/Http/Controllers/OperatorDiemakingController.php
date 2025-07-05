<?php

namespace App\Http\Controllers;

use App\Models\OperatorDiemaking;
use Illuminate\Http\Request;

class OperatorDiemakingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $operatorDiemakings = OperatorDiemaking::all();
        return inertia('operatorDiemaking/operatorDiemakings', [
            'operatorDiemakings' => $operatorDiemakings,
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
        $validated = $request->validate([
            'nama_operator_diemaking' => 'required|string|max:255',
        ]);

        $validated['nama_operator_diemaking'] = strtoupper($validated['nama_operator_diemaking']);

        OperatorDiemaking::create($validated);
        return redirect()->back()->with('success', 'Operator Die Making added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(OperatorDiemaking $operatorDiemaking)
    {
        return inertia('operatorDiemaking/show', [
            'operatorDiemaking' => $operatorDiemaking,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(OperatorDiemaking $operatorDiemaking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $operatorDiemaking = OperatorDiemaking::findOrFail($id);
        $validated = $request->validate([
            'nama_operator_diemaking' => 'required|string|max:255',
        ]);

        $validated['nama_operator_diemaking'] = strtoupper($validated['nama_operator_diemaking']);


        $operatorDiemaking->update($validated);
        return redirect()->back()->with('success', 'Operator Die Making updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $operatorDiemaking = OperatorDiemaking::findOrFail($id);
        $operatorDiemaking->delete();
        return redirect()->back()->with('success', 'Operator Die Making deleted successfully!');
    }
}
